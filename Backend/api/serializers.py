from rest_framework import serializers
from .models import Tag, Bill, Wishlist

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]

class BillSerializer(serializers.ModelSerializer):
    tags = TagSerializer(read_only=True, many=True)
    tag_ids = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, source="tags", write_only=True, required=False)

    class Meta:
        model = Bill
        fields = ["id", "name", "value", "type", "day", "tags", "tag_ids", "month"]

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ["id", "name", "price", "link", "created_at"]


class BillImportSerializer(serializers.Serializer):
    Name = serializers.CharField(max_length=200)
    Value = serializers.DecimalField(max_digits=12, decimal_places=2)
    Type = serializers.ChoiceField(choices=[c[0] for c in Bill.TYPE_CHOICES])
    Date = serializers.DateField(required=False)
    day = serializers.IntegerField(required=False)
    month = serializers.IntegerField(required=False)
    year = serializers.IntegerField(required=False)
    Tags = serializers.ListField(child=serializers.CharField(), required=False)

    def validate(self, data):
        # Ensure we can derive year/month/day either from Date or from fields
        if not data.get("Date") and not (data.get("year") and data.get("month")):
            raise serializers.ValidationError("Provide either 'Date' or both 'year' and 'month'.")
        return data