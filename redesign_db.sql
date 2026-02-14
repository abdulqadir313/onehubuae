
============================================================
MERMAID DIAGRAM
============================================================
https://mermaid.ai/view/d0da675b-a5cf-419b-9a55-f7d36dfc5836

============================================================
DATABASE DESIGN
============================================================

============================================================
USER MODULE
============================================================

TABLE: user_types
-----------------
id INT PK AUTO_INCREMENT
type_name VARCHAR(50) UNIQUE

DEFAULT:
1 admin
2 brand
3 influencer


TABLE: user_status
------------------
id INT PK AUTO_INCREMENT
status_name VARCHAR(50) UNIQUE
description VARCHAR(255)

DEFAULT:
1 active
2 suspended
3 blocked
4 deleted
5 pending_verification


TABLE: users
------------
id BIGINT PK AUTO_INCREMENT
name VARCHAR(150) NOT NULL
email VARCHAR(150) UNIQUE NOT NULL
password VARCHAR(255) NOT NULL
phone VARCHAR(30)
country VARCHAR(100)
city VARCHAR(100)
profile_pic VARCHAR(255)
dob DATE
gender ENUM('male','female','other')
bio TEXT
user_type_id INT
status_id INT
is_verified TINYINT DEFAULT 0
is_active TINYINT DEFAULT 1

FK user_type_id → user_types.id
FK status_id → user_status.id

INDEX(email)
INDEX(user_type_id)
INDEX(status_id)


TABLE: user_status_logs
-----------------------
id BIGINT PK AUTO_INCREMENT
user_id BIGINT
status_id INT
changed_by BIGINT
reason TEXT

FK user_id → users.id
FK status_id → user_status.id


============================================================
PROFILE MODULE
============================================================

TABLE: brand_profiles
---------------------
id BIGINT PK AUTO_INCREMENT
user_id BIGINT UNIQUE
company_name VARCHAR(200)
industry VARCHAR(100)
website VARCHAR(255)
company_size VARCHAR(50)

FK user_id → users.id


TABLE: influencer_profiles
--------------------------
id BIGINT PK AUTO_INCREMENT
user_id BIGINT UNIQUE
display_name VARCHAR(150)
price_start DECIMAL(10,2)
rating_avg DECIMAL(3,2)
total_reviews INT DEFAULT 0

FK user_id → users.id


============================================================
WISHLIST MODULE
============================================================

TABLE: wishlists
----------------
id BIGINT PK AUTO_INCREMENT
brand_id BIGINT
wishlist_name VARCHAR(150)

FK brand_id → users.id
INDEX(brand_id)


TABLE: wishlist_items
---------------------
id BIGINT PK AUTO_INCREMENT
wishlist_id BIGINT
influencer_id BIGINT

FK wishlist_id → wishlists.id
FK influencer_id → users.id

UNIQUE KEY (wishlist_id, influencer_id)


============================================================
NOTIFICATION MODULE
============================================================

TABLE: notifications
--------------------
id BIGINT PK AUTO_INCREMENT
user_id BIGINT
title VARCHAR(255)
message TEXT
type VARCHAR(50)
ref_id BIGINT
is_read TINYINT DEFAULT 0

FK user_id → users.id


============================================================
SOCIAL & CATEGORY MODULE
============================================================

TABLE: platforms
----------------
id BIGINT PK AUTO_INCREMENT
name VARCHAR(100)
icon VARCHAR(255)
is_active TINYINT DEFAULT 1


TABLE: social_accounts
----------------------
id BIGINT PK AUTO_INCREMENT
user_id BIGINT
platform_id BIGINT
username VARCHAR(150)
profile_url VARCHAR(255)
followers BIGINT DEFAULT 0
engagement_rate DECIMAL(5,2)
created_at DATETIME

FK user_id → users.id
FK platform_id → platforms.id


TABLE: categories
-----------------
id INT PK AUTO_INCREMENT
name VARCHAR(100)
slug VARCHAR(120)
image VARCHAR(255)
is_active TINYINT DEFAULT 1
created_at DATETIME


TABLE: influencer_categories
----------------------------
id BIGINT PK AUTO_INCREMENT
user_id BIGINT
category_id INT

FK user_id → users.id
FK category_id → categories.id


============================================================
SUBSCRIPTION (BRAND PLANS)
============================================================

TABLE: plans
------------
id INT PK AUTO_INCREMENT
name VARCHAR(100)
price DECIMAL(10,2)
currency VARCHAR(10)

campaign_limit INT
influencer_invite_limit INT
wishlist_limit INT

chat_enabled TINYINT(1)
priority_support TINYINT(1)

duration_days INT
is_active TINYINT(1)


TABLE: subscription_status
--------------------------
id INT PK AUTO_INCREMENT
status_name VARCHAR(50)

DEFAULT:
1 active
2 expired
3 cancelled
4 pending


TABLE: brand_subscriptions
--------------------------
id BIGINT PK AUTO_INCREMENT
brand_id BIGINT
plan_id INT

start_date DATETIME
end_date DATETIME
status_id INT
auto_renew TINYINT(1)

FK brand_id → users.id
FK plan_id → plans.id
FK status_id → subscription_status.id


============================================================
CAMPAIGN MODULE
============================================================

TABLE: campaign_status
----------------------
id INT PK AUTO_INCREMENT
status_name VARCHAR(50)

DEFAULT:
1 draft
2 active
3 paused
4 completed
5 cancelled


TABLE: campaigns
----------------
id BIGINT PK AUTO_INCREMENT
brand_id BIGINT
title VARCHAR(255)
description TEXT
budget_min DECIMAL(12,2)
budget_max DECIMAL(12,2)
start_date DATE
end_date DATE
status_id INT

FK brand_id → users.id
FK status_id → campaign_status.id


============================================================
PROPOSAL MODULE
============================================================

TABLE: proposal_status
----------------------
id INT PK AUTO_INCREMENT
status_name VARCHAR(50)

DEFAULT:
1 pending
2 accepted
3 rejected
4 withdrawn
5 completed


TABLE: campaign_proposals
-------------------------
id BIGINT PK AUTO_INCREMENT
campaign_id BIGINT
influencer_id BIGINT
brand_id BIGINT
message TEXT
price DECIMAL(12,2)
delivery_days INT
status_id INT

FK campaign_id → campaigns.id
FK influencer_id → users.id
FK brand_id → users.id
FK status_id → proposal_status.id


============================================================
ORDER MODULE
============================================================

TABLE: order_status
-------------------
id INT PK AUTO_INCREMENT
status_name VARCHAR(50)
description VARCHAR(255)

DEFAULT:
1 pending
2 payment_pending
3 confirmed
4 in_progress
5 submitted
6 revision_requested
7 approved
8 completed
9 cancelled
10 disputed
11 refunded


TABLE: orders
-------------
id BIGINT PK AUTO_INCREMENT
campaign_id BIGINT
proposal_id BIGINT
brand_id BIGINT
influencer_id BIGINT

total_amount DECIMAL(12,2)
platform_fee DECIMAL(12,2)
final_amount DECIMAL(12,2)

status_id INT
delivery_date DATE
completed_at DATETIME

FK campaign_id → campaigns.id
FK proposal_id → campaign_proposals.id
FK brand_id → users.id
FK influencer_id → users.id
FK status_id → order_status.id


TABLE: order_status_logs
------------------------
id BIGINT PK AUTO_INCREMENT
order_id BIGINT
status_id INT
changed_by BIGINT
note TEXT

FK order_id → orders.id
FK status_id → order_status.id
FK changed_by → users.id


============================================================
PAYMENT MODULE
============================================================

TABLE: payment_status
---------------------
id INT PK AUTO_INCREMENT
status_name VARCHAR(50)

DEFAULT:
1 pending
2 processing
3 paid
4 failed
5 refunded


TABLE: payments
---------------
id BIGINT PK AUTO_INCREMENT
order_id BIGINT
payer_id BIGINT
payee_id BIGINT
amount DECIMAL(12,2)
platform_fee DECIMAL(12,2)
gateway_fee DECIMAL(12,2)
payment_gateway VARCHAR(50)
transaction_id VARCHAR(255)
status_id INT
paid_at DATETIME

FK order_id → orders.id
FK payer_id → users.id
FK payee_id → users.id
FK status_id → payment_status.id

============================================================
END OF DATABASE DESIGN
============================================================