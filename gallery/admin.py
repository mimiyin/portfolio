from django.contrib import admin
from gallery.models import Project

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('order', 'code', 'title', 'medium', 'date_created')
    
admin.site.register(Project, ProjectAdmin)