import { describe, it, expect } from 'vitest';
import {
  isTitleField,
  isDescriptionField,
  isLongTextField,
  isDateField,
  isLinkField,
  isImageField,
  isAuthorField,
  isCategoryField,
  getFieldTypeCategory,
} from '../fieldTypeDetection';

describe('fieldTypeDetection', () => {
  describe('isTitleField', () => {
    it('should return true for "title"', () => {
      expect(isTitleField('title')).toBe(true);
    });

    it('should return true for "name"', () => {
      expect(isTitleField('name')).toBe(true);
    });

    it('should return true for case-insensitive matches', () => {
      expect(isTitleField('TITLE')).toBe(true);
      expect(isTitleField('Title')).toBe(true);
      expect(isTitleField('NaMe')).toBe(true);
    });

    it('should return true for fields containing title', () => {
      expect(isTitleField('itemTitle')).toBe(true);
      expect(isTitleField('post_title')).toBe(true);
    });

    it('should return false for unrelated fields', () => {
      expect(isTitleField('description')).toBe(false);
      expect(isTitleField('link')).toBe(false);
    });
  });

  describe('isDescriptionField', () => {
    it('should return true for "description"', () => {
      expect(isDescriptionField('description')).toBe(true);
    });

    it('should return true for "content"', () => {
      expect(isDescriptionField('content')).toBe(true);
    });

    it('should return true for "summary"', () => {
      expect(isDescriptionField('summary')).toBe(true);
    });

    it('should return true for case-insensitive matches', () => {
      expect(isDescriptionField('DESCRIPTION')).toBe(true);
      expect(isDescriptionField('Content')).toBe(true);
    });

    it('should return true for fields containing these terms', () => {
      expect(isDescriptionField('itemDescription')).toBe(true);
      expect(isDescriptionField('post_content')).toBe(true);
    });

    it('should return false for unrelated fields', () => {
      expect(isDescriptionField('title')).toBe(false);
      expect(isDescriptionField('link')).toBe(false);
    });
  });

  describe('isLongTextField', () => {
    it('should be an alias for isDescriptionField', () => {
      expect(isLongTextField('description')).toBe(true);
      expect(isLongTextField('content')).toBe(true);
      expect(isLongTextField('summary')).toBe(true);
      expect(isLongTextField('title')).toBe(false);
    });
  });

  describe('isDateField', () => {
    it('should return true for "date"', () => {
      expect(isDateField('date')).toBe(true);
    });

    it('should return true for "time"', () => {
      expect(isDateField('time')).toBe(true);
    });

    it('should return true for case-insensitive matches', () => {
      expect(isDateField('DATE')).toBe(true);
      expect(isDateField('Time')).toBe(true);
    });

    it('should return true for fields containing date/time', () => {
      expect(isDateField('pubDate')).toBe(true);
      expect(isDateField('updated_time')).toBe(true);
    });

    it('should return false for unrelated fields', () => {
      expect(isDateField('title')).toBe(false);
      expect(isDateField('link')).toBe(false);
    });
  });

  describe('isLinkField', () => {
    it('should return true for "link"', () => {
      expect(isLinkField('link')).toBe(true);
    });

    it('should return true for "url"', () => {
      expect(isLinkField('url')).toBe(true);
    });

    it('should return true for "guid"', () => {
      expect(isLinkField('guid')).toBe(true);
    });

    it('should return true for case-insensitive matches', () => {
      expect(isLinkField('LINK')).toBe(true);
      expect(isLinkField('Url')).toBe(true);
      expect(isLinkField('GUID')).toBe(true);
    });

    it('should return true for fields containing link/url/guid', () => {
      expect(isLinkField('permalink')).toBe(true);
      expect(isLinkField('item_url')).toBe(true);
      expect(isLinkField('post_guid')).toBe(true);
    });

    it('should return false for unrelated fields', () => {
      expect(isLinkField('title')).toBe(false);
      expect(isLinkField('description')).toBe(false);
    });
  });

  describe('isImageField', () => {
    it('should return true for "image"', () => {
      expect(isImageField('image')).toBe(true);
    });

    it('should return true for "img"', () => {
      expect(isImageField('img')).toBe(true);
    });

    it('should return true for "enclosure"', () => {
      expect(isImageField('enclosure')).toBe(true);
    });

    it('should return true for "thumbnail"', () => {
      expect(isImageField('thumbnail')).toBe(true);
    });

    it('should return true for "media"', () => {
      expect(isImageField('media')).toBe(true);
    });

    it('should return true for case-insensitive matches', () => {
      expect(isImageField('IMAGE')).toBe(true);
      expect(isImageField('Thumbnail')).toBe(true);
    });

    it('should return true for fields containing these terms', () => {
      expect(isImageField('itemImage')).toBe(true);
      expect(isImageField('post_thumbnail')).toBe(true);
    });

    it('should return false for unrelated fields', () => {
      expect(isImageField('title')).toBe(false);
      expect(isImageField('link')).toBe(false);
    });
  });

  describe('isAuthorField', () => {
    it('should return true for "author"', () => {
      expect(isAuthorField('author')).toBe(true);
    });

    it('should return true for "creator"', () => {
      expect(isAuthorField('creator')).toBe(true);
    });

    it('should return true for case-insensitive matches', () => {
      expect(isAuthorField('AUTHOR')).toBe(true);
      expect(isAuthorField('Creator')).toBe(true);
    });

    it('should return true for fields containing author/creator', () => {
      expect(isAuthorField('itemAuthor')).toBe(true);
      expect(isAuthorField('post_creator')).toBe(true);
    });

    it('should return false for unrelated fields', () => {
      expect(isAuthorField('title')).toBe(false);
      expect(isAuthorField('link')).toBe(false);
    });
  });

  describe('isCategoryField', () => {
    it('should return true for "category"', () => {
      expect(isCategoryField('category')).toBe(true);
    });

    it('should return true for "tag"', () => {
      expect(isCategoryField('tag')).toBe(true);
    });

    it('should return true for case-insensitive matches', () => {
      expect(isCategoryField('CATEGORY')).toBe(true);
      expect(isCategoryField('Tag')).toBe(true);
    });

    it('should return true for fields containing category/tag', () => {
      expect(isCategoryField('itemCategory')).toBe(true);
      expect(isCategoryField('post_tag')).toBe(true);
    });

    it('should return false for unrelated fields', () => {
      expect(isCategoryField('title')).toBe(false);
      expect(isCategoryField('link')).toBe(false);
    });
  });

  describe('getFieldTypeCategory', () => {
    it('should return correct category for title fields', () => {
      expect(getFieldTypeCategory('title')).toBe('title');
      expect(getFieldTypeCategory('name')).toBe('title');
    });

    it('should return correct category for description fields', () => {
      expect(getFieldTypeCategory('description')).toBe('description');
      expect(getFieldTypeCategory('content')).toBe('description');
      expect(getFieldTypeCategory('summary')).toBe('description');
    });

    it('should return correct category for date fields', () => {
      expect(getFieldTypeCategory('date')).toBe('date');
      expect(getFieldTypeCategory('time')).toBe('date');
    });

    it('should return correct category for link fields', () => {
      expect(getFieldTypeCategory('link')).toBe('link');
      expect(getFieldTypeCategory('url')).toBe('link');
      expect(getFieldTypeCategory('guid')).toBe('link');
    });

    it('should return correct category for image fields', () => {
      expect(getFieldTypeCategory('image')).toBe('image');
      expect(getFieldTypeCategory('thumbnail')).toBe('image');
    });

    it('should return correct category for author fields', () => {
      expect(getFieldTypeCategory('author')).toBe('author');
      expect(getFieldTypeCategory('creator')).toBe('author');
    });

    it('should return correct category for category fields', () => {
      expect(getFieldTypeCategory('category')).toBe('category');
      expect(getFieldTypeCategory('tag')).toBe('category');
    });

    it('should return "default" for unknown fields', () => {
      expect(getFieldTypeCategory('unknown')).toBe('default');
      expect(getFieldTypeCategory('customField')).toBe('default');
    });

    it('should prioritize first matching category', () => {
      // If a field matches multiple patterns, it should return the first match
      // This tests the order of checks in getFieldTypeCategory
      expect(getFieldTypeCategory('title')).toBe('title');
    });
  });
});

