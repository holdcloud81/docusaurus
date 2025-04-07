
## VM Name
접두사
- 리눅스: lnx
- 윈도우: win

## 가상머신 이름
접두사-vm-vmid
- lnx-vm-001
- win-vm-001

## VM ID
- alt+shift+f 표 정렬
  
| VMID      | 사용 용도                   |
| --------- | --------------------------- |
| 1001~1199 | 리눅스 서버 (dns, dhcp 등 ) |
| 1201~1299 | 리눅스 서버 ()              |
| 2001~2199 | 윈도우 서버                 |

## vm list
| VMID | 서비스   | 내용                      |
| ---- | -------- | ------------------------- |
| 1001 | kea-dhcp | kea dhcp primary server   |
| 1002 | kea-dhcp | kea dhcp secondary server |