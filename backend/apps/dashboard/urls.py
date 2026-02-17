from django.urls import path
from .views import (
    DashboardStatsView, PopularCarsView,
    RecentOrdersView, RevenueStatsView
)

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('popular-cars/', PopularCarsView.as_view(), name='popular-cars'),
    path('recent-orders/', RecentOrdersView.as_view(), name='recent-orders'),
    path('revenue/', RevenueStatsView.as_view(), name='revenue-stats'),
]