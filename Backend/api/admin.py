from django.contrib import admin
from .models import Tag, Bill, Wishlist

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name")

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    def tag_list(self, obj):
        return ", ".join([t.name for t in obj.tags.all()])
    tag_list.short_description = "tags"

    list_display = ("id", "name", "value", "type", "day", "tag_list", "month", "created_at")

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "link", "created_at")