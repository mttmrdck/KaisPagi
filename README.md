# 🌤️ Kais Pagi

KaisPagi takes its name from a Malay idiom:

  *"Kais pagi makan pagi, kais petang makan petang"*

It describes a life with no buffer, no savings, no safety net. You work today, you eat today. You don't work, you don't eat. For millions of B40 Malaysians, this isn't a saying — it's a daily reality. 

KaisPagi is an AI-powered poverty simulation game that puts you in the shoes of a B40 household in Malaysia. Over 15 days, you face the real financial decisions that low-income Malaysians navigate every day — unexpected medical bills, school fees, job instability, rising food prices, and the constant threat of debt. Every choice has consequences. There are no perfect options.

Built for KitaHack 2026, KaisPagi addresses UN SDG 1: No Poverty by turning empathy into experience. Rather than reading statistics about poverty, you live it, watching your bank balance erode day by day, feeling the pull of predatory loans when you're desperate, and understanding why smart people make decisions that look irrational from the outside.

Instead of static, predictable gameplay, *Kais Pagi* utilizes the **Google Gemini API** to dynamically generate unpredictable daily life events forcing players to make difficult financial decisions in real-time. 

### 🎯 The Mission & SDG Alignment
This project directly aligns with the United Nations Sustainable Development Goals (SDGs):
* **Goal 1 (No Poverty):** By gamifying the B40 experience, we aim to build empathy and spread awareness about the systemic difficulties of living paycheck-to-paycheck.
* **Goal 10 (Reduced Inequalities):** Highlighting the disparity in how unexpected expenses disproportionately impact lower-income individuals compared to those with financial safety nets.

### ⚙️ How It Works
1. **Dynamic Scenarios:** Every day (Day 1-15), the Gemini AI analyzes the player's current financial and stress state to generate a unique, contextual scenario and two difficult choices.
2. **Resource Management:** Players must weigh the cost of every action. Choosing the cheaper option (e.g., skipping a meal to save RM10) might save money but drastically increase their Stress meter. 
3. **Analytics Tracking:** We utilize Firebase Analytics to monitor the most common choices players make, providing real-world data on which financial trade-offs are perceived as the most difficult.

### Technical Infrastructure
* **Frontend:** React + TypeScript (powered by Vite)
* **AI Engine:** Google Gemini API (`@google/genai` SDK)
* **Backend & Hosting:** Firebase (Analytics & Hosting)

### Implementation Details
1. **AI-Powered Dynamic Life Events**

Unlike traditional "Choose Your Own Adventure" games, KaisPagi uses Generative AI to ensure no two playthroughs are the same.
  * **Contextual Prompting:** Gemini is fed parameters like Current_Cash, Debt_Level, and Day_Number. It then generates a "Crisis" that is mathematically difficult but narratively grounded in Malaysian reality.
  * **The "Desperation" Logic:** As the bank balance nears zero, the AI is programmed to introduce higher-risk "predatory" options (unlicensed moneylenders), simulating the trap of the poverty cycle

2. **Real-World Economic Mapping**

The game incorporates localized Malaysian economic factors:
  * **B40 Nuances:** Specific references to GRAB earnings, EPF withdrawals, and local "Kedai Runcit" credit.
  * **Financial Friction:** Small costs that have massive ripples—like a RM50 fine being the difference between a full meal and a skipped one.

### Challenges Faced
1. **Balancing the "Unfairness":** It was a challenge to make the game "winnable" but still authentically difficult.

Solution: We tuned the Gemini prompts to ensure scenarios were grounded in real Malaysian B40 data.

2. **Firebase Analytics Not Showing:**  Events weren't appearing in Firebase DebugView during testing.
   
Solution: Found missing import lines in the analytics setup and enabled debug mode before Analytics initializes.

3. **Gemini API Not Responding:**  The app consistently threw error 400, 429, 404 despite having a valid API key, completely blocking AI scenario generation.
   
Solution: After debugging, we discovered two simultaneous issues. First, we switched to Gemini 3 Flash Preview model instead of the other models as the previously used models didnt worked. Second, the error 429 consistently pops up due to our quota has been exceeded numerous times during our testing phase. We solved it by creating a new API key. 

### Future Roadmap
1. **Short-term**
  * **Resource Directory:** At the end of a "Game Over," provide links to actual NGOs, Zakat offices, or government aid programs for players who are actually in these situations.
  * **Faster AI:** Switching to a faster and more powerful AI model  to kill loading times and make the game snappy.
  * **Custom Length:** Choose your challenge mode from either 7-day "Quick Stress", 15-day "Normal Reality" or a 30-day "Hardcore Month."
2. **Long-term vision**
  * **Hyper-Localization:** Specific modules for urban poor (KL) vs. rural poor (East Malaysia), accounting for different cost of living indices.
  * **Policy Integration:** Creating a version for policymakers where they can "test" the impact of a new subsidy or price hike on the simulated B40 "agents" to see how quickly they fall into debt.
  * **Multiplayer Mode:** Survive together as a family. Share one bank account and argue over how to spend the last RM50.


## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- A Google Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### Installation

1. Clone the repository
git clone https://github.com/mttmrdck/KaisPagi.git

2. Install dependencies
npm install

3. Install Firebase tools globally
npm install -g firebase-tools

4. Login to Firebase
firebase login

5. Create a `.env` file in the root folder
GEMINI_API_KEY=your_gemini_api_key_here

6. Run the development server (locally)
npm run dev

NOTE: This project uses a shared Firebase configuration for Analytics tracking. You do not need to set up your own Firebase project. 
All analytics data from your session will be collected into our Firebase dashboard for research and impact measurement purposes. 
The only key you need is your own Gemini API key for AI scenario generation. We used Gemini 3 Flash Preview as our AI model.
