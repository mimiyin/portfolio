# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Project.presenters'
        db.delete_column(u'gallery_project', 'presenters')


    def backwards(self, orm):
        # Adding field 'Project.presenters'
        db.add_column(u'gallery_project', 'presenters',
                      self.gf('jsonfield.fields.JSONField')(default=[]),
                      keep_default=False)


    models = {
        u'gallery.project': {
            'Meta': {'object_name': 'Project'},
            'collaborators': ('django.db.models.fields.CharField', [], {'max_length': '1000', 'blank': 'True'}),
            'date_created': ('django.db.models.fields.DateField', [], {}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '10000', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materials': ('jsonfield.fields.JSONField', [], {'default': '{}'}),
            'medium': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'order': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '250'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        }
    }

    complete_apps = ['gallery']