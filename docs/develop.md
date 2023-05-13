# SoundVault Develop Log

## Design

- Track
  - SocialFi
  - Infra & Scalability

- Bounty:

     - Particle Network


     - Web3MQ


## Plan 

Smart Contract :

- Member Repuation 4/23

- Governance Token 4/23

- Music NFT 4/23 - 4/25
  - Create(Mint)  4/23 
  - Purchase 4/24
  - Recommend Music4/24 
    - By vote 4/25
    - By Purchase 4/25
  
- FanClub NFT
  - Follow to generate 4/26
  
- Fund Raising
  - Donate 4/26
  
- UpgradeAble 4/26'

- Test 4/27 - 4/28

DAPP

- Login / Logout 4/29
- Music Upload (Consumer) 4/29
- Music List / show Revenues 4/30
- Donate 4/31
- Music Play 5/1
- FanClub 5/2

## Logs

### 4.23

- Struct User (finished)

  ```
  Struct User {
  	uint purchase;
  	uint vote;
  	uint timestamp;
  	address NFTaddress; // Anyone who owns nft or donate or vote will have nft
  }
  ```

- Governance Token (finished)

  - Define Token
  - Implement Interface

- NFT Token (finished) @todo Transfer ownership required

  - Define Token
  - Implement Interface

<hr />

### 4.24-4.25

- Create
  - Fee （Finish 4.24）
  - Music (Finish 4.24)
  - FanNFT (Finish 4.24)
  - List (Finish 4.24)
- Purchase
  - Fee (Finish 4.25)
  - Purchase List (Finish 4.25)
- Vote (Finish 4.25)
- Sort (Finish 4.25)
  - By vote (Finish 4.25)
  - By Purchase (Finish 4.25)

<hr />

### 4.26

- Follow to generate 4/26 (Finish 4.25)
	- eligble (Finish 4.26)
	- airdrop(prerequiste) (Finish 4.26)
- Donate 4/26 (Finish 4.26)
- Upgradable Study (Unfinish, abandoned)

<hr />

### 4.27

- Test (Finish FanNFT 4.27)

<hr />

### 4.28-4.29

- Test (finish Platform)

<hr />

### 4.30

- Deploy (finish Platform)

<hr />

### 5.1

- Deploy Info
- Framework build up - React

- LogIn (Logout, Network Requirement)  for Par

<hr />

### 5.2 - 5.4

- Framework
- DashBoard
- Problems
   - dashboard 
   - create lack information - user
   - getOwneMusicIdList spelling

<hr>

### 5.5

- Author 

- Problems : 
  - contentHashmapping update error
  - add music.cid
  - merge music & musicSelling

<hr>

### 5.7

Explore

- Purchase(finish)
- Vote (finish)
- Follow (to be added)

<hr >

### 5.8

Collections 

- Update amountToPay

Fanclub

- Layout design

<hr />

### 5.9

 Fanclub

- Layout design

<hr>

### 5.10

-  Modify contracts
- Retest
- Layout optimization

<hr />

### 5.11 

- Layout Optimization
- Fanclub intergration

<hr />

### 5.12 

- Web3MQ signing debug
- Intergrating Particle Network

<hr />

### 5.13

- Doumentation



