from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Tag, Bill, Wishlist
from .serializers import TagSerializer, BillSerializer, WishlistSerializer, BillImportSerializer
from datetime import datetime, date
import json

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

    @action(detail=False, methods=["post"], url_path="upload-json")
    def upload_json(self, request):
        """Endpoint to upload JSON (file or raw body) and create Bill records.

        Accepts multipart file with key `file` or JSON body containing a single object
        or a list of objects in the format specified by the user.
        """
        payload = None
        if "file" in request.FILES:
            f = request.FILES["file"]
            try:
                content = f.read()
                if isinstance(content, bytes):
                    content = content.decode("utf-8")
                payload = json.loads(content)
            except Exception as e:
                return Response({"detail": "Invalid JSON file", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            payload = request.data

        items = payload if isinstance(payload, list) else [payload]

        created = []
        errors = []
        for idx, item in enumerate(items):
            serializer = BillImportSerializer(data=item)
            if not serializer.is_valid():
                errors.append({"index": idx, "errors": serializer.errors})
                continue
            data = serializer.validated_data

            date_val = data.get("Date")
            if date_val:
                month_date = date(date_val.year, date_val.month, 1)
                day_val = data.get("day") or date_val.day
            else:
                try:
                    y = int(data.get("year"))
                    m = int(data.get("month"))
                    month_date = date(y, m, 1)
                    day_val = data.get("day", 1)
                except Exception:
                    errors.append({"index": idx, "errors": "Invalid year/month"})
                    continue

            bill = Bill.objects.create(
                name=data["Name"],
                value=data["Value"],
                type=data["Type"],
                month=month_date,
                day=day_val,
            )

            tags = data.get("Tags") or data.get("tags")
            if tags:
                for t in tags:
                    tag_obj, _ = Tag.objects.get_or_create(name=t)
                    bill.tags.add(tag_obj)

            created.append({"id": bill.id, "name": bill.name})

        if errors and created:
            return Response({"created": created, "errors": errors}, status=status.HTTP_207_MULTI_STATUS)
        if errors and not created:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"created": created}, status=status.HTTP_201_CREATED)

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all().order_by("-created_at")
    serializer_class = WishlistSerializer