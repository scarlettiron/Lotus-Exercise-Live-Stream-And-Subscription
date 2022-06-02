from django.apps import AppConfig


class UsertransactionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'userTransactions'
    
    def ready(self):
        import userTransactions.signals
