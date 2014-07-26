# Create your views here.
from django.shortcuts import render_to_response
from django.template import RequestContext
from gallery.models import Project

import re


def index(request):
    projects = list(Project.objects.values().order_by('medium'))
    template = 'base.html'
    
    media = {}
    for p, project in enumerate(projects):
        m = project['medium']
        try:
            media[m]
        except:
            media[m] = []
            
        media[m].append(project)

    for m, medium in media.items():
        media[m] = sorted(medium, key=lambda x: x['order'])

    return render_to_response(template, { 'media' : media }, context_instance=RequestContext(request))

def froog(request):
    template = 'froog.html'
    return render_to_response(template, {}, context_instance=RequestContext(request))
