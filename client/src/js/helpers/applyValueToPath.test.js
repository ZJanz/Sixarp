import { expect } from 'chai';

import functionUnderTest from './applyValueToPath';

describe('[helpers/applyValueToPath] Apply Value To Path', () => {
  describe('when given a path with a single element', () => {
    let existingObject, result;
    beforeEach(() => {
      existingObject = { x: 10, y: 20 };
      result = functionUnderTest({ ...existingObject }, 'z', 30);
    });
    it('should apply the value a single level deep', () => {
      expect(result.z).to.equal(30);
    });
    it('should not create any deeper objects', () => {
      Object.keys(result).forEach(key => {
        expect(typeof result[key]).to.not.equal('object');
      });
    });
  });
  describe('when given a path with an existing property', () => {
    let existingObject, result;
    beforeEach(() => {
      existingObject = { x: 10, y: 20 };
      result = functionUnderTest({ ...existingObject }, 'x', 30);
    });
    it('should overwrite existing properties', () => {
      expect(result.x).to.equal(30);
    });
    it('should not create any deeper objects', () => {
      Object.keys(result).forEach(key => {
        expect(typeof result[key]).to.not.equal('object');
      });
    });
  })
  describe('when given a path with multiple elements', () => {
    let existingObject, result;
    beforeEach(() => {
      existingObject = { existing: { obj: { path: { x: 10, y: 20 } } } };
      result = functionUnderTest({ ...existingObject }, 'existing.obj.path.z', 30);
    });
    it('should apply the value to the expected depth', () => {
      expect(result.existing.obj.path.z).to.equal(30);
      expect(Object.keys(result).length).to.equal(1);
      expect(Object.keys(result.existing).length).to.equal(1);
      expect(Object.keys(result.existing.obj).length).to.equal(1);
      expect(Object.keys(result.existing.obj.path).length).to.equal(3);
    });
  });
});