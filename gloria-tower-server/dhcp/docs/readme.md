# primary dhcp server
- dhcp 서버를 설치 및 구성하고 active/standby 고가용성으로 구성한다.

## dhcp primary 서버 환경
- 배포: kvm 가상머신
- 호스트이름: prod-dhcp-svr01
- 사용자이름: administrator
- 암호: ****
- IP: 192.168.11.141 고정IP 사용용
- mac: 52:54:00:97:69:e7

## primary 서버 구성 변경
```
# 호스트 이름 변경
sudo hostnamectl hostname prod-dhcp-svr01

# 시간 변경
sudo timedatectl set-timezone Asia/Seoul

# 인터페이스 확인
ip link

# ip 설정
sudo tee /etc/netplan/01-netcfg.yaml << EOF
network:
  version: 2
  ethernets:
    enp1s0:
      dhcp4: false
      addresses:
      - 192.168.11.141/24
      routes:
      - to: default
        via: 192.168.11.254
      nameservers:
        addresses:
          - 168.126.63.1
          - 168.126.63.2

# network 적용
sudo netplan apply 

## 재시작
sudo reboot now
```
## ssh 공개키 적용
원격pc에서 접속하는 ssh 공개키를 적용한다. 

```
# openssh 설치
sudo apt install openssh-server -y

# ssh 디렉터리 설치
mkdir /home/administrator/.ssh

# 원격 pc에서 공개키 전송
get-content .\.ssh\id_rsa.pub | ssh administrator@192.168.11.141 "cat >> ./.ssh/authorized_keys"
```

## dhcp 서버 설치
isc-dhcp-server 서버를 설치한다. 
```
sudo apt update
sudo apt install isc-dhcp-server -y
```
## dhcp 구성 
구성 설정 파일
- ***/etc/default/isc-dhcp-server:*** dhcp 인터페이스 설정 파일
- ***/etc/dhcp/dhcpd.conf:*** dhcp 주요 설정, ip 범위 파일
- ***/etc/dhcp/subnet/*.conf:*** 서브넷 구성 설정
- ***/var/lib/dhcp/dhcpd.leases:*** dhcp 임대 저장 파일
  

## dhcp 인터페이스 설정
파일에서 DHCP 인터페이스와 전역 설정을 활성화하려면 다음 파일에서 주석을 제거한다.

[isc-dhcp.server](/dhcp/configs/kvm-svr01/isc-dhcp-server)

## dhcp 서버의 전역 설정
DHCP 서버의 전역 설정은 다음 파일에서 구성하고 업데이트한다.
- DHCP 공통 설정을 구성한다.
- failover 구성한다.
- 서브넷 구성 파일을 `include`로 추가하고 /etc/dhcp/subnet 저장한다. 
  
[dhcpd.conf](/dhcp/configs/kvm-svr01/dhcpd.conf)
```
# 구성 파일 편집 
sudo nano /etc/dhcp/dhcpd.conf

# 서브넷 구성 파일
include "/etc/dhcp/subnet/192.168.11.0.conf";
```
## 서브넷 구성 파일
- 서브넷은 전역설정에서 서브넷 별로 분리 작성 후 `/etc/dhcp/subnet` 저장한다.

- [192.168.11.0](/dhcp/configs/kvm-svr01/192.168.11.0.conf)
- 모든 서브넷은 [subnet.md](/dhcp/docs/dhcp-svr01.md) 문서에서 관리한다.

## 구성 파일 검사
dhcp 서비스를 적용하기전에 구문파일을 검사한다. 
- `sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf
` 

## 서비스 등록 및 재시작
```
# 서비스 등록
sudo systemctl enable isc-dhcp-server

# 서비스 재시작
sudo systemctl restart isc-dhcp-server

# 서비스 상태 확인
sudo systemctl status isc-dhcp-server
```

---
---

# secondary dhcp server
- dhcp 서버를 구성하고 고가용성으로 구성한다.

## dhcp secondary 서버 환경
- 배포: kvm 가상머신
- 호스트이름: prod-dhcp-svr02 
- 사용자이름: administrator
- 암호: ****
- IP: 192.168.11.142
- mac: 52:54:00:54:42:62

## secondary 서버 구성 변경
```
# 호스트 이름 변경
sudo hostnamectl hostname prod-dhcp-svr02

# 시간 변경
sudo timedatectl set-timezone Asia/Seoul

# 인터페이스 확인
ip link

# ip 설정
sudo tee /etc/netplan/01-netcfg.yaml << EOF
network:
  version: 2
  ethernets:
    enp1s0:
      dhcp4: false
      addresses:
      - 192.168.11.142/24
      routes:
      - to: default
        via: 192.168.11.254
      nameservers:
        addresses:
          - 168.126.63.1
          - 168.126.63.2

# network 적용
sudo netplan apply 

## 재시작
sudo reboot now
```
## ssh 공개키 적용
원격pc에서 접속하는 ssh 공개키를 적용한다. 

```
# openssh 설치
sudo apt install openssh-server -y

# ssh 디렉터리 설치
mkdir /home/administrator/.ssh

# 원격 pc에서 공개키 전송
get-content .\.ssh\id_rsa.pub | ssh administrator@192.168.11.142 "cat >> ./.ssh/authorized_keys"
```

## dhcp 서버 설치
isc-dhcp-server 서버를 설치한다. 
```
sudo apt update
sudo apt install isc-dhcp-server -y
```
## dhcp 구성 
주요 구성 설정 파일
- ***/etc/default/isc-dhcp-server:*** dhcp 인터페이스 설정 파일
- ***/etc/dhcp/dhcpd.conf:*** dhcp 주요 설정, 서브넷, ip 범위 파일
- ***/var/lib/dhcp/dhcpd.leases:*** dhcp 임대 저장 파일

## dhcp 인터페이스 설정
파일에서 DHCP 인터페이스와 전역 설정을 활성화하려면 다음 파일에서 주석을 제거한다.

[isc-dhcp.server](/dhcp/configs/kvm-svr02/isc-dhcp-server)

## dhcp 서버의 전역 설정
DHCP 서버의 전역 설정은 다음 파일에서 구성하고 업데이트한다.
- DHCP 공통 설정을 구성한다.
- failover 구성한다.
- 서브넷 구성 파일을 `include`로 추가하고 /etc/dhcp/subnet 저장한다. 
  
[dhcpd.conf](/dhcp/configs/kvm-svr02/dhcpd.conf)
```
# 구성 파일 편집 
sudo nano /etc/dhcp/dhcpd.conf

# 서브넷 구성 파일
include "/etc/dhcp/subnet/192.168.11.0.conf";
```
## 서브넷 구성 파일
- 서브넷은 전역설정에서 서브넷 별로 분리 작성 후 `/etc/dhcp/subnet` 저장한다.

- [192.168.11.0](/dhcp/configs/kvm-svr02/192.168.11.0.conf)
- 모든 서브넷은 [subnet.md](/dhcp/docs/dhcp-svr01.md) 문서에서 관리한다.

## 구성 파일 검사
dhcp 서비스를 적용하기전에 구문파일을 검사한다. 
- `sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf
` 

## 서비스 등록 및 재시작
```
# 서비스 등록
sudo systemctl enable isc-dhcp-server

# 서비스 재시작
sudo systemctl restart isc-dhcp-server

# 서비스 상태 확인
sudo systemctl status isc-dhcp-server
```


---
---


# L3 스위치 구성
L3 스위치에서 서버 VLAN1000의 IP-helper-address 추가한다. 
- dhcp 서버의 primary 192.168.11.141 설정한다.
- dhcp 서버의 secondary 192.168.11.141 설정한다.

```
interface Vlan100 
 ip helper-address 192.168.11.1    # Primary DHCP 서버
 ip helper-address 192.168.11.2    # Secondary DHCP 서버
```
---
---
# dhcp 구성 파일 공유
primary 서버에서 dhcp 서브넷 파일을 secondary로 자동 동기화를 설정한다.

dhcp 구성 파일 디렉터리를 nfs 공유하여 primary, secondary 같은 설정파일을 사용 한다.

### primary 서버에서 nfs 설치 및 공유
```
# nfs 설치
sudo apt update
sudo apt install nfs-kernel-server -y

# /etc/exports 파일에 dhcp 서브넷 디렉터리를 공유
/etc/dhcp/subnet 192.168.11.142(rw,sync,no_root_squash,no_subtree_check)
```

### secondary 서버에서 nfs 클라이언트 설치 및 마운트
```
# nfs 클라이언트 설치
sudo apt update
sudo apt install nfs-common -y

# Primary 서버의 /etc/dhcp/subnet 디렉토리를 Secondary 서버의 /etc/dhcp/subnet 마운트
sudo mount 192.168.11.141:/etc/dhcp/subnet /etc/dhcp/subnet

# NFS 마운트를 영구적으로 유지 /etc/fstab 파일에 아래 내용 추가
192.168.11.141:/etc/dhcp/subnet /etc/dhcp/subnet nfs defaults 0 0
```