from calendar import monthrange
from datetime import datetime, timedelta

begin_date = datetime.utcnow()
end_date = datetime.utcnow() + timedelta(days=30)

print(begin_date)
print(begin_date.year)
print(end_date)