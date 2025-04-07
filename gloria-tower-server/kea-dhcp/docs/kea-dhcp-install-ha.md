# 기본 환경

- Kea DHCP 서버 2대
  - primary: 192.168.12.11, lnx-vm-1001
  - secondary: 192.168.12.12, lnx-vm-1002
- DHCP 범위: 192.168.12.51~100
- HA 모드: hot standby

## kea-dhcp 설치

모든 서버에 kea dhcp 설치한다.

```bash
sudo curl -1sLf \
  'https://dl.cloudsmith.io/public/isc/kea-2-6/setup.deb.sh' \
  | sudo -E bash

sudo apt update -y
sudo apt install -y isc-kea -y

설치가 완료되면 라이브러리 확인, 서비스를 등록한다. 

# 라이브러리 확인
ls -al /usr/lib/x86_64-linux-gnu/kea/hooks

# 서비스 등록 및 시작
sudo systemctl enable isc-kea-dhcp4-server
sudo systemctl enable isc-kea-ctrl-agent
sudo systemctl start isc-kea-dhcp4-server
sudo systemctl start isc-kea-ctrl-agent
```

## ha 서버 설정

서브넷은 외부 파일에서 지정해서 불러오는것으로 하고 dhcp 기본 옵션과 ha 설정을 진행한다.

### primary 서버 설정 (192.168.12.11:lnx-vm-1001)

구성파일 /etc/kea/kea-dhcp4.conf 편집한다.

```conf
{
    "Dhcp4": {

        "hooks-libraries": [
            {
                "library": "/usr/lib/x86_64-linux-gnu/kea/hooks/libdhcp_lease_cmds.so"
            },
            {
                "library": "/usr/lib/x86_64-linux-gnu/kea/hooks/libdhcp_ha.so",
                "parameters": {
                    "high-availability": [
                        {
                            "this-server-name": "lnx-vm-1001",
                            "mode": "hot-standby",
                            "heartbeat-delay": 60000,                            
                            "peers": [
                                {
                                    "name": "lnx-vm-1001",
                                    "url": "http://192.168.12.11:8000/",
                                    "role": "primary",
                                    "auto-failover": true
                                },
                                {
                                    "name": "lnx-vm-1002",
                                    "url": "http://192.168.12.12:8000/",
                                    "role": "standby",
                                    "auto-failover": true
                                }
                            ]
                        }
                    ]
                }
            }
        ],
    }
}
```

### secondary 서버 설정 (192.168.12.12:lnx-vm-1002)

primary 서버에 설정한 구성파일에 "this-server-name" secondary 서버 이름만 설정한다.

```conf
"parameters": {
                    "high-availability": [
                        {
                            "this-server-name": "lnx-vm-1002",
                            "mode": "hot-standby",
```

## 서브넷 설정

서브넷 파일은 [구성파일](../configs/common/)에서 업데이트 한다.
