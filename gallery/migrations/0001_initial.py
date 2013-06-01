# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Project'
        db.create_table(u'gallery_project', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('medium', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=250)),
            ('collaborators', self.gf('django.db.models.fields.CharField')(max_length=1000, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(max_length=10000, blank=True)),
            ('materials', self.gf('jsonfield.fields.JSONField')(default={})),
            ('date_created', self.gf('django.db.models.fields.DateField')()),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
        ))
        db.send_create_signal(u'gallery', ['Project'])


    def backwards(self, orm):
        # Deleting model 'Project'
        db.delete_table(u'gallery_project')


    models = {
        u'gallery.project': {
            'Meta': {'object_name': 'Project'},
            'collaborators': ('django.db.models.fields.CharField', [], {'max_length': '1000', 'blank': 'True'}),
            'date_created': ('django.db.models.fields.DateField', [], {}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '10000', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materials': ('jsonfield.fields.JSONField', [], {'default': '{}'}),
            'medium': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '250'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        }
    }

    complete_apps = ['gallery']