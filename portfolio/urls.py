from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'gallery.views.index', name='index'),
    url(r'^froog$', 'gallery.views.froog', name='froog'),

    # url(r'^portfolio/', include('portfolio.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    
    (r'^js/(.*)', serve,   
        {'document_root': os.path.join(os.path.dirname(__file__), "static")}),
    (r'^css/(.*)', serve,   
        {'document_root': os.path.join(os.path.dirname(__file__), "static")}),
)
