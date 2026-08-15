# MARKETING CAMPAIGN & MULTI-CHANNEL ROI ANALYTICS PLATFORM
## MCA Final Project Documentation & Technical Report

**Project Title**: Marketing Campaign & Multi-Channel ROI Analytics Platform  
**Team Name**: Insight Innovators  
**Academic Program**: Master of Computer Applications (MCA) Final Year Project  
**Primary Database / Data Warehouse**: Snowflake (`MARKETING_ANALYTICS.MARKETING_SCHEMA.MARKETING_ETL`)  
**Backend & Data Layer**: Snowflake Cloud Data Warehouse & Python Data Services  
**Frontend Framework**: React 18, TypeScript, Vite, Tailwind CSS  
**Verified Overall ROI**: **746.96%** (Total Revenue: ₹205,981,967,467.00 | Total Spend: ₹24,320,196,730.04)

---

## ACADEMIC DECLARATION & CERTIFICATE

This technical project report documents the implementation of the **Marketing Campaign & Multi-Channel ROI Analytics Platform**, developed by **Insight Innovators**. The platform represents a complete end-to-end data engineering, cloud warehousing, and interactive business intelligence web application.

---

## ABSTRACT

In modern enterprise marketing, organizations deploy campaigns across multiple fragmented digital channels (Google Ads, Meta Ads, LinkedIn Ads, Email Marketing, and Organic Search). Measuring the true Return on Investment (ROI) across these disparate channels is often compromised by siloed data, unweighted average ROI formulas, and static reporting tools.

The **Marketing Campaign & Multi-Channel ROI Analytics Platform** addresses these challenges by establishing an automated 6-stage data lifecycle:
1. **Marketing Source Data**: Raw multi-channel CSV telemetry ingestion.
2. **MySQL Operational Database**: Relational transactional staging.
3. **Alteryx ETL & Data Preparation**: Automated data cleansing, type transformation, and revenue weightings (`REVENUE2`).
4. **Snowflake Data Warehouse**: High-performance cloud data warehousing (`MARKETING_ETL`).
5. **Data Governance & Data Quality**: Zero-division protection (`NULLIF`), input sanitization, and data lineage auditing.
6. **React Analytics Platform**: An interactive web portal featuring Executive KPIs, Multi-Channel ROI, Campaign Registers (7,709 campaigns), Customer Segmentation, Email Telemetry, an interactive SQL Analytics Console, and the INSIGHTS AI conversational analytics engine.

Through rigorous mathematical standardization, overall enterprise ROI is calculated dynamically as:
$$\text{Overall ROI} = \left(\frac{\text{SUM(revenue2)} - \text{SUM(spend)}}{\text{SUM(spend)}}\right) \times 100 = \mathbf{746.96\%}$$

---

## CHAPTER 1: INTRODUCTION & PROJECT OVERVIEW

### 1.1 Background Context
Modern digital marketing relies heavily on multi-touch attribution. Enterprises spend billions annually across digital channels, yet marketing executives frequently struggle to obtain an accurate, real-time picture of which channels and campaigns generate the highest return per rupee spent.

### 1.2 Deliverables
The project delivers a fully functional, production-ready analytics platform:
- **Relational Staging Store**: Operational MySQL database schemas.
- **ETL Workflows**: Alteryx data preparation packages.
- **Cloud Warehouse Table**: Snowflake `MARKETING_ANALYTICS.MARKETING_SCHEMA.MARKETING_ETL`.
- **Frontend SPA**: React 18, TypeScript, and Tailwind CSS single-page application.
- **Conversational Engine**: INSIGHTS AI copilot for instant natural language analytics.
- **SQL Console**: Live SQL execution workspace connected to Snowflake.

---

## CHAPTER 2: PROBLEM STATEMENT & MOTIVATION

### 2.1 The Challenge of Fragmented Data Silos
Marketing telemetry is generated independently by ad networks, email servers, and web analytics tools. Disparate naming conventions, schema variations, and timezone mismatches make unified reporting extremely difficult.

### 2.2 Mathematical Flaws in Unweighted ROI Averaging
Standard reporting tools frequently compute channel-level ROI by taking simple unweighted averages (`AVG(ROI)`). This approach treats a small ₹10,000 campaign with a 300% ROI identically to a ₹5,000,000 campaign with a 150% ROI, distorting corporate financial decisions.

### 2.3 Lack of Real-Time SQL & Conversational Intelligence
Traditional BI portals are rigid and static. Executives cannot query raw Snowflake schemas or ask conversational questions to identify top-performing channels instantly.

---

## CHAPTER 3: PROJECT OBJECTIVES & SCOPE

### 3.1 Core Objectives
1. Implement an end-to-end data orchestration and governance pipeline.
2. Enforce standardized aggregate ROI calculation across all system views:
   $$\text{ROI} = \left(\frac{\text{SUM(revenue2)} - \text{SUM(spend)}}{\text{SUM(spend)}}\right) \times 100$$
3. Deliver live dynamic telemetry connecting React frontend to Snowflake Data Warehouse.
4. Provide interactive modules for Executive Dashboard, Multi-Channel ROI, Campaign Registers, Customer Segmentation, Email Analytics, SQL Workspace, and INSIGHTS AI.

### 3.2 Implemented Scope vs. Future Roadmap
- **Implemented Scope**: Complete pipeline stages, full React 18 UI, INSIGHTS AI, SQL Analytics Workspace, search, multi-column sorting, pagination, and CSV export.
- **Future Roadmap (Out-of-Scope for Current Version)**: Embedded Power BI dashboards and Power Automate alert triggers.

---

## CHAPTER 4: SYSTEM ARCHITECTURE & WORKFLOW LIFECYCLE

### 4.1 Pipeline Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PROJECT DATA PIPELINE & WORKFLOW                   │
│          END-TO-END DATA ORCHESTRATION & GOVERNANCE LIFECYCLE           │
└─────────────────────────────────────────────────────────────────────────┘

[1. Marketing Source Data] (Google • Meta • Email CSVs)
          │
          ▼
[2. MySQL Operational Database] (Structured data storage)
          │
          ▼
[3. Alteryx ETL & Data Preparation] (Clean • Transform • Validate)
          │
          ▼
[4. Snowflake Data Warehouse] (Cloud analytics warehouse)
          │
          ▼
[5. Data Governance & Quality] (Validation • Consistency • Security • Lineage)
          │
          ▼
[6. React Analytics Platform] (Insight Innovators UI Portal & INSIGHTS AI)
       ├── Executive Dashboard
       ├── Multi-Channel ROI
       ├── Campaign Analysis
       ├── Customer Segmentation
       ├── Email Analytics
       ├── SQL Analytics Workspace
       └── INSIGHTS AI Copilot
```

---

## CHAPTER 5: DATA ENGINEERING & ETL PIPELINE

### 5.1 MySQL Operational Relational Schema
Operational tables house raw transactional inputs:
- `raw_campaigns`: Campaign metadata, start/end dates, budget limits.
- `raw_channels`: Category definitions (`LinkedIn Ads`, `Google Ads`, `Meta Ads`, `Email Marketing`, `Organic Search`).
- `raw_customers`: Customer IDs, tier segments (`Premium`, `Returning`, `New`).
- `raw_email_logs`: Transmission logs, open timestamps, click events.

### 5.2 Alteryx Data Cleansing & Transformation
The Alteryx ETL workflow executes:
1. **Trimming & Whitespace Removal**: Sanitizes text headers and string attributes.
2. **Numeric Type Conversion**: Casts string numbers to `DECIMAL(18, 2)` and `INTEGER`.
3. **Attributed Revenue Calculation (`REVENUE2`)**: Weighs conversion touchpoints.
4. **Data Aggregation**: Aggregates spend, revenue, impressions, clicks, and conversions per campaign.
5. **Snowflake Bulk Loader**: Pushes transformed rows directly into `MARKETING_ETL`.

---

## CHAPTER 6: CLOUD DATA WAREHOUSING (SNOWFLAKE)

### 6.1 Warehouse Configuration
- **Cloud Provider**: Snowflake Data Cloud
- **Database**: `MARKETING_ANALYTICS`
- **Schema**: `MARKETING_SCHEMA`
- **Fact Table**: `MARKETING_ETL`

### 6.2 Data Schema Specification
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `CAMPAIGN_ID` | `VARCHAR(50)` | Primary Campaign Identifier |
| `CAMPAIGN_NAME` | `VARCHAR(255)` | Campaign Name |
| `CHANNEL_NAME` | `VARCHAR(100)` | Marketing Channel Name |
| `CUSTOMER_SEGMENT` | `VARCHAR(50)` | Customer Classification Segment |
| `CUSTOMER_ID` | `VARCHAR(50)` | Customer Reference Identifier |
| `SPEND` | `NUMBER(18,2)` | Aggregated Expenditure (INR) |
| `REVENUE2` | `NUMBER(18,2)` | Multi-touch Attributed Revenue (INR) |
| `CONVERSIONS` | `NUMBER(38,0)` | Attributed Conversion Volume |
| `CLICKS` | `NUMBER(38,0)` | Click Volume |
| `IMPRESSIONS` | `NUMBER(38,0)` | Impression Volume |
| `EMAILS_SENT` | `NUMBER(38,0)` | Dispatched Email Count |
| `EMAILS_OPENED` | `NUMBER(38,0)` | Opened Email Count |
| `EMAILS_CLICKED` | `NUMBER(38,0)` | Clicked Email Count |
| `CTR` | `NUMBER(10,2)` | Click-Through Rate Percentage |
| `ROI` | `NUMBER(10,2)` | Return on Investment Percentage |

---

## CHAPTER 7: DATA GOVERNANCE, QUALITY & SECURITY

1. **Division-by-Zero Safety**: All SQL ratio calculations enforce `NULLIF(SUM(spend), 0)` and `NULLIF(SUM(emails_sent), 0)` to guarantee mathematical stability.
2. **SQL Query Sanitization**: The SQL Analytics workspace enforces strict string validation to permit only read-only `SELECT` statements.
3. **Snowflake Dataset Fidelity**: All dashboard components reflect exact Snowflake `MARKETING_ETL` aggregations to guarantee UI fidelity.

---

## CHAPTER 8: DATA WAREHOUSE & ANALYTICS ARCHITECTURE (SNOWFLAKE + REACT)

The architecture connects React/TypeScript directly with the Snowflake Cloud Data Warehouse:

| Data Telemetry Stream | Query / Aggregate Focus | Output Dataset Payload |
| :--- | :---: | :--- |
| `KPI Telemetry` | Total Revenue, Total Spend, Aggregate ROI, CTR | `{ Total Revenue, Total Spend, Overall ROI, Average CTR }` |
| `Channel Aggregates` | Channel spend, revenue, ROI & CTR | `[{ channel, revenue, spend, roi, ctr }]` |
| `Campaign Breakdown` | Campaign spend, revenue, conversions & status | `[{ campaign, revenue, spend, conversions, roi, ctr }]` |
| `Customer Segments` | Segment counts & customer total value | `[{ customer_segment, total_customers, total_revenue }]` |
| `Email Analytics` | Open rates, click rates & funnel conversions | `{ emails_sent, emails_opened, emails_clicked, average_open_rate, average_click_rate }` |
| `SQL Analytics Query` | Custom SELECT query execution | `{ columns: [...], results: [...], count: N }` |

---

## CHAPTER 9: FRONTEND WEB APPLICATION (REACT 18 & TYPESCRIPT)

The user interface is structured as a modern single-page application (SPA):
1. **Executive Dashboard**: Displays Overall ROI (**746.96%** / **747%**), Total Revenue (**₹205.98B**), Total Spend (**₹24.32B**), Customer Loyalty Share Chart (Premium: 4,401, Returning: 4,383, New: 4,288), and Monthly ROI Trend.
2. **Multi-Channel ROI**: Stacked bar charts and channel attribution treemaps.
3. **Campaign Breakdown**: Interactive table displaying **7,709 campaigns**, calculating per-campaign ROI dynamically (Top campaign *Monitored leadingedge access* shows **725.20%** ROI and **7.36%** CTR).
4. **Customer Segmentation**: Detailed customer tier analytics.
5. **Email Analytics**: Email volumes (**12.45B** sent, **3.72B** opened, **664.49M** clicked), Open Rate (**29.88%**), Sent CTR (**5.34%**), CTOR (**17.86%**).
6. **SQL Analytics Workspace**: Live SQL editor with quick actions, execution timer, and CSV export.
7. **INSIGHTS AI**: Conversational assistant answering natural language questions using live data.

---

## CHAPTER 10: TESTING, VALIDATION & VERIFICATION SUMMARY

The platform was thoroughly tested across 10 distinct verification dimensions:

| Test Case | Objective | Test Procedure | Verified Outcome |
| :--- | :--- | :--- | :--- |
| **1. Snowflake vs Dashboard** | Verify overall ROI and totals match Snowflake `MARKETING_ETL` | Executed `test_all_apis.py` and cross-referenced with Snowflake SQL queries | **PASSED**: Overall ROI = `746.96%`, Total Revenue = `₹205,981,967,467.00`, Total Spend = `₹24,320,196,730.04` |
| **2. Dashboard vs SQL Workspace** | Verify channel aggregate query returns identical numbers | Ran Quick Action 2 in SQL Workspace against `/api/channels` API output | **PASSED**: Top ROI Channel = `LinkedIn Ads` (`749.54%` ROI), Lowest = `Organic Search` (`745.36%` ROI) |
| **3. INSIGHTS AI Validation** | Verify AI returns live dynamic Snowflake attribution answer | Prompted AI with *"Which channel produces highest ROI?"* | **PASSED**: AI answered `LinkedIn Ads` with `749.54%` ROI and `₹42.02B` revenue |
| **4. Email KPI Validation** | Verify volume formatting and percentage formulas | Checked raw Snowflake email counts | **PASSED**: Sent = `12.45B`, Open Rate = `29.88%`, Sent CTR = `5.34%`, CTOR = `17.86%` |
| **5. API Endpoint Testing** | Verify HTTP response codes and JSON schemas across all routes | Executed automated test script `backend/test_all_apis.py` | **PASSED**: All 6 endpoints returned `HTTP 200 OK` |
| **6. Search & Filter Testing** | Test campaign table search and dropdown filters | Searched `"Monitored"` and filtered by `"Organic Search"` | **PASSED**: Results filtered instantly with 100% precision |
| **7. CSV Export Testing** | Test CSV file generation and downloading | Triggered Export CSV buttons in Campaign Table & SQL Workspace | **PASSED**: Downloaded clean `.csv` files matching active view rows |
| **8. Hardcoded Analytics Audit** | Audit codebase for static numbers | Executed `grep_search` across entire workspace for mock values | **PASSED**: 0 hardcoded analytics values found; 100% dynamic API telemetry |
| **9. UI & Navigation Testing** | Verify sidebar tabs, dark mode toggle, modal switchers | Interactive UI click testing across desktop and mobile breakpoints | **PASSED**: Smooth navigation without layout shifts |
| **10. Data Governance Validation** | Test zero-spend division safety (`NULLIF`) | Executed test queries with 0 spend and 0 impressions | **PASSED**: Zero runtime errors or `NaN` values produced |

---

## CHAPTER 11: BUSINESS BENEFITS & EXPECTED OUTCOMES

1. **Elimination of Reporting Distortion**: Standardization on aggregate ROI prevents misallocation of ad spend.
2. **Sub-Second Insight Latency**: Replaces multi-day manual spreadsheet consolidation with instant API requests.
3. **Estimated +15–20% Efficiency Gain**: Enables immediate budget reallocation to top channels (LinkedIn Ads and Google Ads).

---

## CHAPTER 12: LIMITATIONS & FUTURE ENHANCEMENTS

### 12.1 Current Limitations
- **Cloud Network Dependency**: Live data fetch relies on active Snowflake cloud availability.
- **Read-Only Console**: SQL Analytics is restricted to `SELECT` operations.

### 12.2 Future Enhancements
- **Embedded Power BI Dashboards**: Integrating native Power BI embedded reports into the React interface.
- **Power Automate Integration**: Triggering automated Microsoft Power Automate workflow alerts when campaign performance drops.
- **Machine Learning Attribution**: Incorporating Shapley Value and Markov Chain attribution models.

---

## CHAPTER 13: AI USAGE DECLARATION

AI technology (Antigravity AI Assistant) was utilized during development for code generation, UI layout polish, backend test script creation, and documentation structuring. All data models, SQL queries, formulas, and REST routes were validated against authoritative Snowflake data warehouse records.
