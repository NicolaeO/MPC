from datetime import date

# Rotating pool of article topics.
# Edit freely — add topics, remove ones already covered, change the focus.
# (Topics already covered by existing posts in public/posts/ have been removed.)
TOPICS = [
    "practical money-saving strategies for new professionals in the USA",
    "understanding US credit cards: how to maximize rewards without paying interest",
    "understanding Social Security benefits and how they are calculated",
    "how to dispute errors on your credit report",
    "understanding your employee benefits package: what to enroll in and what to skip",
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
    "how to save on prescription medications in the USA",
    "understanding 529 college savings plans for your children",
    "tips for managing money when you have variable or seasonal income",
]


def get_todays_topic() -> str:
    """Returns a topic for today, rotating through the list based on day of year."""
    day_of_year = date.today().timetuple().tm_yday
    return TOPICS[day_of_year % len(TOPICS)]
