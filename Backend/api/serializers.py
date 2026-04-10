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