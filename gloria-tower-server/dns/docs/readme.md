# dns 서버 설치 및 구성
클라이언트에 이름 또는 주소 확인 서비스를 제공하도록 DNS(도메인 이름 시스템) 서버를 구성하려면 BIND DNS를 설치한다.

## 서버 환경
### primary
운영체제: ubuntu 24.04
서버이름: prod-dns-svr01
IP 주소: 192.168.11.143
사용자: gloria
패스워드: azurekeyvault

### secondary
운영체제: ubuntu 24.04
서버이름: prod-dns-svr02
IP 주소: 192.168.11.144
사용자: gloria
패스워드: azurekeyvault

## 구성 목표

- dns 서버를 설치 및 구성하고 active/standby 고가용성으로 구성한다.
- isc-dhcp-server와 통합하고 dns 레코드 동적업데이트를 구성한다.

## 가상머신 생성
kvm 호스트에서 스크립트를 사용해서 prod-dns-svr01,prod-dns-svr02 이름으로 가상머신을 생성한다.

### dhcp 서버에 IP 예약
스크립트로 생성된 mac 주소를 운영중인 dhcp 서버에 prod-dns-svr01,prod-dns-svr02 가상머신 IP 예약을 등록한다. 

```
# /etc/dhcp/subnet/192.168.11.0.conf 파일에서 편집
host prod-dns-svr01 {
    hardware ethernet 52:54:00:7e:af:a5;
    fixed-address 192.168.11.143;
}

host prod-dns-svr02 {
    hardware ethernet 52:54:00:40:dd:4a;
    fixed-address 192.168.11.144;
}

# dhcp 서버에서 수정 후 서비스 재시작
sudo systemctl restart isc-dhcp-server
```
