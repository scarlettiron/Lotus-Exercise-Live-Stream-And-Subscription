from calendar import month, monthrange
from datetime import datetime, timedelta
import pendulum
from django.utils.dateparse import parse_datetime
from dateutil.parser import *

begin_date_utc = datetime.utcnow()
end_date = datetime.utcnow() + timedelta(days=30)

print(begin_date_utc)
print(end_date)

begin_date = pendulum.now('utc').to_iso8601_string()
end_date = pendulum.now('utc').add(months=1).to_iso8601_string()
print(begin_date)
print(end_date)

django_start = parse(begin_date)
django_end = parse(end_date)

print(django_start)
print(django_end)