import { expect } from 'chai';


describe('[Entity Lifecycle Helpers]', () => {
  describe('createEntity', () => {
    test.todo('should create an object with a UUIDv4 and a render function');
  });

  describe('isEntity', () => {
    describe('when provided an object with a id and render prop', () => {
      test.todo('should return true');
    });
  });

  describe('deltaEntities', () => {
    describe('when the source is an empty array', () => {
      test.todo('should return the full comparison array');
    });
    describe('when source contains no common entities', () => {
      test.todo('should return the full comparison array');
    });
    describe('when comparison is equal to source', () => {
      test.todo('should return an empty array');
    });
  });
});