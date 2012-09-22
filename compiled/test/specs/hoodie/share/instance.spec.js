// Generated by CoffeeScript 1.3.3

describe("Hoodie.Share.Instance", function() {
  beforeEach(function() {
    this.hoodie = new Mocks.Hoodie;
    Hoodie.Share.Instance.prototype.hoodie = this.hoodie;
    return this.share = new Hoodie.Share.Instance({
      id: 'share1'
    });
  });
  describe("constructor", function() {
    beforeEach(function() {
      return spyOn(Hoodie.Share.Instance.prototype, "set").andCallThrough();
    });
    it("should set passed options", function() {
      var share;
      share = new Hoodie.Share.Instance({
        option1: "value1",
        option2: "value2"
      });
      return expect(Hoodie.Share.Instance.prototype.set).wasCalledWith({
        option1: "value1",
        option2: "value2"
      });
    });
    it("should set id from options.id", function() {
      var share;
      share = new Hoodie.Share.Instance({
        id: 'id123'
      });
      return expect(share.id).toBe('id123');
    });
    it("should generate an id if options.id wasn't passed", function() {
      var share;
      share = new Hoodie.Share.Instance;
      return expect(share.id).toBe('uuid');
    });
    return it("should default access to false", function() {
      var share;
      share = new Hoodie.Share.Instance;
      return expect(share.access).toBe(false);
    });
  });
  describe("#set(key, value)", function() {
    _when("key is a string", function() {
      it("should set key as instance variable", function() {
        this.share.set("access", true);
        return expect(this.share.access).toBe(true);
      });
      return it("shouldn't allow to set unknown options", function() {
        this.share.set("unknownOption", "funky");
        return expect(this.share.unknownOption).toBe(void 0);
      });
    });
    return _when("key is a hash", function() {
      it("should set all options from passed hash", function() {
        var key, value, _ref, _results;
        this.options = {
          access: true,
          continuous: true,
          password: 'secret'
        };
        this.share.set(this.options);
        _ref = this.options;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          _results.push(expect(this.share[key]).toBe(value));
        }
        return _results;
      });
      return it("shouldn't set unnown options", function() {
        var key, _results;
        this.options = {
          unknown: 1,
          malicious: 2
        };
        this.share.set(this.options);
        _results = [];
        for (key in this.options) {
          _results.push(expect(this.share[key]).toBe(void 0));
        }
        return _results;
      });
    });
  });
  describe("#get(key)", function() {
    return it("should return value of passed property", function() {
      this.share.funky = 'fresh';
      return expect(this.share.funky).toBe('fresh');
    });
  });
  describe("#save(update, options)", function() {
    beforeEach(function() {
      this.updatePromise = this.hoodie.defer();
      spyOn(this.hoodie.my.store, "update").andReturn(this.updatePromise.promise());
      return spyOn(this.share, "set").andCallThrough();
    });
    _when("user has no account yet", function() {
      beforeEach(function() {
        spyOn(this.hoodie.my.account, "hasAccount").andReturn(false);
        return spyOn(this.hoodie.my.account, "anonymousSignUp");
      });
      return it("should sign up anonymously", function() {
        this.share.save();
        return expect(this.hoodie.my.account.anonymousSignUp).wasCalled();
      });
    });
    _when("user has an account", function() {
      beforeEach(function() {
        spyOn(this.hoodie.my.account, "hasAccount").andReturn(true);
        return spyOn(this.hoodie.my.account, "anonymousSignUp");
      });
      return it("should not sign up anonymously", function() {
        this.share.save();
        return expect(this.hoodie.my.account.anonymousSignUp).wasNotCalled();
      });
    });
    _when("update passed", function() {
      it("should set the passed properties", function() {
        this.share.save({
          funky: 'fresh'
        });
        return expect(this.share.set).wasCalledWith({
          funky: 'fresh'
        });
      });
      return it("should update $share with properties updated using #set() before", function() {
        this.share._memory = {};
        this.share.set('access', true);
        this.share.set('password', 'secret');
        this.share.save();
        return expect(this.hoodie.my.store.update).wasCalledWith('$share', 'share1', {
          access: true,
          password: 'secret'
        }, void 0);
      });
    });
    it("should return a promise", function() {
      return expect(this.share.save()).toBePromise();
    });
    return it("should update its properties with attributes returned from store.update", function() {
      this.updatePromise.resolve({
        funky: 'fresh'
      });
      this.share.save();
      return expect(this.share.funky).toBe('fresh');
    });
  });
  describe("#add(objects, sharedAttributes)", function() {
    beforeEach(function() {
      return spyOn(this.share, "toggle");
    });
    it("should call #toggle with passed objects and sharedAttributes", function() {
      this.share.add(['object1', 'object2'], ['attribute1', 'attribute2']);
      return expect(this.share.toggle).wasCalledWith(['object1', 'object2'], ['attribute1', 'attribute2']);
    });
    return it("should default sharedAttributes to true", function() {
      this.share.add(['object1', 'object2']);
      return expect(this.share.toggle).wasCalledWith(['object1', 'object2'], true);
    });
  });
  describe("#remove(objects)", function() {
    return it("should call #toggle with passed objects and false", function() {
      spyOn(this.share, "toggle");
      this.share.remove(['object1', 'object2']);
      return expect(this.share.toggle).wasCalledWith(['object1', 'object2'], false);
    });
  });
  describe("#toggle(objects, filter)", function() {
    beforeEach(function() {
      spyOn(this.hoodie.my.store, "updateAll").andCallFake(function(objects, updateFunction) {
        var object, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          object = objects[_i];
          _results.push($.extend(object, updateFunction(object)));
        }
        return _results;
      });
      return this.objects = [
        {
          $type: 'todo',
          id: '1',
          title: 'milk'
        }, {
          $type: 'todo',
          id: '2',
          title: 'flakes',
          $shares: {
            'share1': true
          }
        }, {
          $type: 'todo',
          id: '2',
          title: 'flakes',
          "private": 'note',
          $shares: {
            'share1': ['title']
          }
        }
      ];
    });
    return _when("called without filter", function() {
      beforeEach(function() {
        return this.updatedObjects = this.share.toggle(this.objects);
      });
      it("should add unshared objects to the share", function() {
        return expect(this.updatedObjects[0].$shares.share1).toBe(true);
      });
      return it("should remove objects belonging to share", function() {
        expect(this.updatedObjects[1].$shares).toBe(void 0);
        return expect(this.updatedObjects[2].$shares).toBe(void 0);
      });
    });
  });
  describe("#sync()", function() {
    beforeEach(function() {
      spyOn(this.share, "save").andReturn(this.hoodie.defer().resolve().promise());
      spyOn(this.share, "findAllObjects").andReturn(['object1', 'object2']);
      spyOn(this.hoodie.my.remote, "sync");
      return this.share.sync();
    });
    it("should save the share", function() {
      return expect(this.share.save).wasCalled();
    });
    return it("should sync all objects belonging to share", function() {
      return expect(this.hoodie.my.remote.sync).wasCalledWith(['object1', 'object2']);
    });
  });
  describe("#destroy()", function() {
    beforeEach(function() {
      spyOn(this.share, "remove").andReturn(this.hoodie.defer().resolve().promise());
      spyOn(this.share, "findAllObjects").andReturn(['object1', 'object2']);
      spyOn(this.hoodie.my.store, "destroy");
      return this.share.destroy();
    });
    it("should remove all objects from share", function() {
      return expect(this.share.remove).wasCalledWith(['object1', 'object2']);
    });
    return it("should remove $share object from store", function() {
      return expect(this.hoodie.my.store.destroy).wasCalledWith('$share', 'share1');
    });
  });
  return describe("#findAllObjects()", function() {
    beforeEach(function() {
      spyOn(this.hoodie.my.store, "findAll").andReturn('findAllPromise');
      this.share.findAllObjects();
      this.filter = this.hoodie.my.store.findAll.mostRecentCall.args[0];
      return this.objects = [
        {
          $type: 'todo',
          id: '1',
          title: 'milk'
        }, {
          $type: 'todo',
          id: '2',
          title: 'flakes',
          $shares: {
            'share1': true
          }
        }, {
          $type: 'todo',
          id: '2',
          title: 'flakes',
          "private": 'note',
          $shares: {
            'share1': ['title']
          }
        }
      ];
    });
    it("should return promise by store.findAll", function() {
      return expect(this.share.findAllObjects()).toBe('findAllPromise');
    });
    return it("should call findAllObjects with a filter that returns only objects that changed and that belong to share", function() {
      expect(this.filter(this.objects[0])).toBe(false);
      spyOn(this.hoodie.my.store, "isDirty").andReturn(true);
      expect(this.filter(this.objects[1])).toBe(true);
      expect(this.filter(this.objects[2])).toBe(true);
      this.hoodie.my.store.isDirty.andReturn(false);
      expect(this.filter(this.objects[1])).toBe(false);
      return expect(this.filter(this.objects[2])).toBe(false);
    });
  });
});
