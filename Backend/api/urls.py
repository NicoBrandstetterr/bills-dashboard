from django.urls import path, include
from rest_framework import routers
from .views import TagViewSet, BillViewSet, WishlistViewSet

router = routers.DefaultRouter()
router.register(r"tags", TagViewSet)
router.register(r"bills", BillViewSet)
router.register(r"wishlist", WishlistViewSet)

urlpatterns = [
    path("", include(router.urls)),
]