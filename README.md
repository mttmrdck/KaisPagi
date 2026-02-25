# 🌤️ Kais Pagi

**Kais Pagi** is an AI-powered life simulation mobile web-app designed to shed light on the daily financial realities and survival choices faced by low-income (B40) households. 

Built for **KitaHack 2026**, this project challenges players to survive a 30-day month by balancing two critical resources: their **Bank Balance** and their **Mental Stress**. 

Instead of static, predictable gameplay, *Kais Pagi* utilizes the **Google Gemini API** to dynamically generate unpredictable daily life events—from unexpected medical bills to sudden car breakdowns—forcing players to make difficult financial decisions in real-time. 

### 🎯 The Mission & SDG Alignment
This project directly aligns with the United Nations Sustainable Development Goals (SDGs):
* **Goal 1 (No Poverty):** By gamifying the B40 experience, we aim to build empathy and spread awareness about the systemic difficulties of living paycheck-to-paycheck.
* **Goal 10 (Reduced Inequalities):** Highlighting the disparity in how unexpected expenses disproportionately impact lower-income individuals compared to those with financial safety nets.

### ⚙️ How It Works
1. **Dynamic Scenarios:** Every day (Day 1-30), the Gemini AI analyzes the player's current financial and stress state to generate a unique, contextual scenario and two difficult choices.
2. **Resource Management:** Players must weigh the cost of every action. Choosing the cheaper option (e.g., skipping a meal to save RM10) might save money but drastically increase their Stress meter. 
3. **Analytics Tracking:** We utilize Firebase Analytics to monitor the most common choices players make, providing real-world data on which financial trade-offs are perceived as the most difficult.

### 🛠️ Tech Stack & Google Technologies
* **Frontend:** React + TypeScript (powered by Vite)
* **AI Engine:** Google Gemini API (`@google/genai` SDK)
* **Backend & Hosting:** Firebase (Analytics & Hosting)
