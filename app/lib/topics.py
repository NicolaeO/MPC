from datetime import date

# Rotating pool of article topics.
# Edit freely — add topics, remove ones already covered, change the focus.
TOPICS = [
    "practical money-saving strategies for new professionals in the USA",
    "how to negotiate your salary and total compensation package in the US job market",
    "understanding US credit cards: how to maximize rewards without paying interest",
    "investing basics for beginners in the USA: index funds, ETFs, and brokerage accounts",
    "how to build an emergency fund and why it matters",
    "understanding Social Security benefits and how they are calculated",
    "filing US taxes as a self-employed professional or freelancer",
    "how to dispute errors on your credit report",
    "understanding your employee benefits package: what to enroll in and what to skip",
    "how to buy a used car in the USA without getting cheated",
    "tips for reducing your monthly expenses without sacrificing quality of life",
    "how to apply for US citizenship: the naturalization process explained",
    "understanding the US rental market: tenant rights and landlord responsibilities",
    "how to start a side business or freelance in the USA while employed full-time",
    "networking effectively in the US: building professional relationships from scratch",
    "how to get a mortgage as an immigrant in the USA",
    "US education system explained: community college, university, and online degrees",
    "practical tips for learning English faster as a working professional",
    "understanding stock options and RSUs at US tech companies",
    "how to find free or low-cost legal help in the USA",
    "navigating the US healthcare system: how to find a doctor and schedule appointments",
    "how to save on prescription medications in the USA",
    "understanding 529 college savings plans for your children",
    "tips for managing money when you have variable or seasonal income",
    "how to protect yourself from common scams targeting immigrants in the USA",
]


def get_todays_topic() -> str:
    """Returns a topic for today, rotating through the list based on day of year."""
    day_of_year = date.today().timetuple().tm_yday
    return TOPICS[day_of_year % len(TOPICS)]
