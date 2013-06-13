from django.db import models
import jsonfield    

# Create your models here.
class Project(models.Model):
    
    class Medium():
        '''
        Type of project
        Determines which column
        it ends up in, in the
        footer nav
        '''
        TEXT = 0
        SCREEN = 1
        PHYSICAL = 2
        PERFORMANCE = 3
        
        CHOICES = (
           (TEXT, 'Text'),
           (SCREEN, 'Screen'),
           (PHYSICAL, 'Physical'),
           (PERFORMANCE, 'Performance'),
           )
    
    order = models.SmallIntegerField(default=0)
    medium = models.IntegerField(choices=Medium.CHOICES, default=Medium.TEXT)   
    code = models.CharField(max_length=20) 
    title = models.CharField(max_length=250)
    tagline = models.CharField(max_length=1000, blank=True)
    collaborators = models.CharField(max_length=1000, blank=True)
    description = models.TextField(max_length=10000, blank=True)
    materials = models.TextField(max_length=10000, blank=True)
    performers = models.TextField(max_length=10000, blank=True)
    music = models.TextField(max_length=10000, blank=True)
    presenters = models.TextField(max_length=10000, blank=True)
    more = models.TextField(max_length=10000, blank=True)
    date_created = models.CharField(max_length=250)
    url = models.URLField(blank=True)