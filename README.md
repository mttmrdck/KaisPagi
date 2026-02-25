# 🌤️ Kais Pagi

KaisPagi takes its name from a Malay idiom:

  *"Kais pagi makan pagi, kais petang makan petang"*

It describes a life with no buffer, no savings, no safety net. You work today, you eat today. You don't work, you don't eat. For millions of B40 Malaysians, this isn't a saying — it's a daily reality. 

KaisPagi is an AI-powered poverty simulation game that puts you in the shoes of a B40 (bottom 40% income group) household in Malaysia. Over 15 days, you face the real financial decisions that low-income Malaysians navigate every day — unexpected medical bills, school fees, job instability, rising food prices, and the constant threat of debt. Every choice has consequences. There are no perfect options.

Built for KitaHack 2026, KaisPagi addresses UN SDG 1: No Poverty by turning empathy into experience. Rather than reading statistics about poverty, you live it — watching your bank balance erode day by day, feeling the pull of predatory loans when you're desperate, and understanding why smart people make decisions that look irrational from the outside.

Instead of static, predictable gameplay, *Kais Pagi* utilizes the **Google Gemini API** to dynamically generate unpredictable daily life events forcing players to make difficult financial decisions in real-time. 

### 🎯 The Mission & SDG Alignment
This project directly aligns with the United Nations Sustainable Development Goals (SDGs):
* **Goal 1 (No Poverty):** By gamifying the B40 experience, we aim to build empathy and spread awareness about the systemic difficulties of living paycheck-to-paycheck.
* **Goal 10 (Reduced Inequalities):** Highlighting the disparity in how unexpected expenses disproportionately impact lower-income individuals compared to those with financial safety nets.

### ⚙️ How It Works
1. **Dynamic Scenarios:** Every day (Day 1-15), the Gemini AI analyzes the player's current financial and stress state to generate a unique, contextual scenario and two difficult choices.
2. **Resource Management:** Players must weigh the cost of every action. Choosing the cheaper option (e.g., skipping a meal to save RM10) might save money but drastically increase their Stress meter. 
3. **Analytics Tracking:** We utilize Firebase Analytics to monitor the most common choices players make, providing real-world data on which financial trade-offs are perceived as the most difficult.

### 🛠️ Tech Stack & Google Technologies
* **Frontend:** React + TypeScript (powered by Vite)
* **AI Engine:** Google Gemini API (`@google/genai` SDK)
* **Backend & Hosting:** Firebase (Analytics & Hosting)
