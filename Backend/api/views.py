from rest_framework import viewsets
from .models import Tag, Bill, Wishlist
from .serializers import TagSerializer, BillSerializer, WishlistSerializer
from datetime import datetime, date

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by("name")
    serializer_class = TagSerializer

class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all().order_by("-month", "-id")
    serializer_class = BillSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        month = self.request.query_params.get("month")
        if month:
            # Expect month in YYYY-MM format
            try:
                dt = datetime.strptime(month, "%Y-%m")
                first = date(dt.year, dt.month, 1)
                qs = qs.filter(month=first)
            except ValueError:
                pass
        return qs

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all().order_by("-created_at")
    serializer_class = WishlistSerializer