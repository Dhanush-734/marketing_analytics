CREATE DATABASE marketing_analytics;
USE marketing_analytics;
SHOW DATABASES;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DESC users;
CREATE TABLE channels (
    channel_id INT AUTO_INCREMENT PRIMARY KEY,
    channel_name VARCHAR(50)
);
CREATE TABLE campaigns (
    campaign_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_name VARCHAR(150),
    channel_id INT,
    campaign_type VARCHAR(50),
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(30),
    FOREIGN KEY (channel_id)
        REFERENCES channels(channel_id)
);
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100),
    gender VARCHAR(20),
    age INT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    customer_segment VARCHAR(50)
);
CREATE TABLE leads (
    lead_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    campaign_id INT,
    lead_source VARCHAR(50),
    lead_status VARCHAR(50),
    created_date DATE,
    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id),
    FOREIGN KEY (campaign_id)
        REFERENCES campaigns(campaign_id)
);
CREATE TABLE conversions (
    conversion_id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT,
    campaign_id INT,
    revenue DECIMAL(12,2),
    conversion_date DATE,
    FOREIGN KEY (lead_id)
        REFERENCES leads(lead_id),
    FOREIGN KEY (campaign_id)
        REFERENCES campaigns(campaign_id)
);
CREATE TABLE daily_performance (
    performance_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    performance_date DATE,
    impressions INT,
    clicks INT,
    spend DECIMAL(12,2),
    conversions INT,
    revenue DECIMAL(12,2),
    FOREIGN KEY (campaign_id)
        REFERENCES campaigns(campaign_id)
);
CREATE TABLE email_campaigns (
    email_campaign_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    emails_sent INT,
    emails_opened INT,
    emails_clicked INT,
    unsubscribed INT,
    FOREIGN KEY (campaign_id)
        REFERENCES campaigns(campaign_id)
);
CREATE TABLE kpi_summary (
    kpi_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    roi DECIMAL(10,2),
    roas DECIMAL(10,2),
    ctr DECIMAL(10,2),
    cpc DECIMAL(10,2),
    cpm DECIMAL(10,2),
    cpa DECIMAL(10,2),
    cac DECIMAL(10,2),
    conversion_rate DECIMAL(10,2),
    FOREIGN KEY (campaign_id)
        REFERENCES campaigns(campaign_id)
);
SHOW TABLES;
DESC users;

DESC campaigns;

DESC customers;

DESC leads;

DESC conversions;

DESC daily_performance;

DESC email_campaigns;

DESC kpi_summary;
USE marketing_analytics;
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM conversions;

DELETE FROM leads;

SET FOREIGN_KEY_CHECKS = 1;
SELECT COUNT(*) FROM leads;
SELECT COUNT(*) FROM conversions;


USE marketing_analytics;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM conversions;
DELETE FROM leads;

SET FOREIGN_KEY_CHECKS = 1;

USE marketing_analytics;

SELECT 'channels' AS table_name, COUNT(*) AS total_rows FROM channels
UNION ALL
SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL
SELECT 'customers', COUNT(*) FROM customers


USE marketing_analytics;

SELECT 'channels' AS table_name, COUNT(*) AS total_rows FROM channels
UNION ALL
SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'conversions', COUNT(*) FROM conversions
UNION ALL
SELECT 'daily_performance', COUNT(*) FROM daily_performance
UNION ALL
SELECT 'email_campaigns', COUNT(*) FROM email_campaigns;

USE marketing_analytics;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM conversions;
DELETE FROM leads;

SET FOREIGN_KEY_CHECKS = 1;

USE marketing_analytics;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM conversions;
DELETE FROM daily_performance;
DELETE FROM email_campaigns;
DELETE FROM leads;

SET FOREIGN_KEY_CHECKS = 1;

USE marketing_analytics;

DESCRIBE leads;
TRUNCATE TABLE leads;

LOAD DATA LOCAL INFILE 'C:/Users/snowpiercer/Desktop/marketing_analytics/datasets/generated/leads.csv'
INTO TABLE leads
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(lead_id, customer_id, campaign_id, lead_source, lead_status, created_date);
DROP TABLE IF EXISTS leads;



USE marketing_analytics;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS conversions;
DROP TABLE IF EXISTS leads;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE leads (
    lead_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    campaign_id INT NOT NULL,
    lead_source VARCHAR(100),
    lead_status VARCHAR(50),
    created_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id)
);

DESCRIBE leads;



SHOW GLOBAL VARIABLES LIKE 'local_infile';
SET GLOBAL local_infile = 1;
SHOW GLOBAL VARIABLES LIKE 'local_infile';
USE marketing_analytics;

LOAD DATA LOCAL INFILE 'C:/Users/snowpiercer/Desktop/marketing_analytics/datasets/generated/leads.csv'
INTO TABLE leads
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS
(lead_id, customer_id, campaign_id, lead_source, lead_status, created_date);

USE marketing_analytics;

DROP TABLE IF EXISTS conversions;

CREATE TABLE conversions (
    conversion_id INT PRIMARY KEY,
    lead_id INT NOT NULL,
    campaign_id INT NOT NULL,
    revenue DECIMAL(10,2) NOT NULL,
    conversion_date DATE NOT NULL,

    CONSTRAINT fk_conversion_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(lead_id),

    CONSTRAINT fk_conversion_campaign
        FOREIGN KEY (campaign_id)
        REFERENCES campaigns(campaign_id)
);

USE marketing_analytics;

SELECT 'channels' AS table_name, COUNT(*) AS total_rows FROM channels
UNION ALL
SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT * FROM leads;
UNION ALL
SELECT 'conversions', COUNT(*) FROM conversions
UNION ALL
SELECT 'daily_performance', COUNT(*) FROM daily_performance
UNION ALL
SELECT 'email_campaigns', COUNT(*) FROM email_campaigns;