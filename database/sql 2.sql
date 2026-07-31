USE marketing_analytics;
SHOW TABLES;
SELECT * FROM channels;

SELECT * FROM channels;


SELECT COUNT(*) AS channels FROM channels;

SELECT COUNT(*) AS campaigns FROM campaigns;

SELECT COUNT(*) AS customers FROM customers;

SELECT COUNT(*) AS leads FROM leads;

SELECT 'channels' AS table_name, COUNT(*) AS total_rows FROM channels

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE conversions;
TRUNCATE TABLE leads;

SET FOREIGN_KEY_CHECKS = 1;
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

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM conversions;
DELETE FROM leads;

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM conversions;

DELETE FROM leads;

SET FOREIGN_KEY_CHECKS = 1;