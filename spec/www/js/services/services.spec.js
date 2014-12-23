describe('stick2it.services', function() {

  beforeEach(module('stick2it.services'));

  describe('stick2itDb', function() {

    it('exists', function() {
      inject(function(stick2itDb) {
        expect(stick2itDb).toBeDefined();
        expect(stick2itDb.get).toBeDefined();
        expect(stick2itDb.store).toBeDefined();
        expect(stick2itDb.loadSettings).toBeDefined();
      });
    });

    describe('.get', function() {

      var
        db,
        fakeWindowService;

      beforeEach(module('stick2it.services', function($provide) {
        fakeWindowService = buildFakeWindowService('getItem')
        $provide.value('$window', fakeWindowService);
      }));

      beforeEach(inject(function(stick2itDb) {
        db = stick2itDb;
      }));

      it('calls .getItem with key', function(done) {
        var localStorage = fakeWindowService.localStorage;
        localStorage.getItem.and.returnValue('{ "msg": "You did it!" }');

        var getPromise = db.get('someKey');

        debugger

        getPromise
          .then(function(value) {
            debugger
            expect(localStorage.getItem).toHaveBeenCalled();
            expect(localStorage.getItem.mostRecentCall.args[0]).toBe('someKey');
            done();
          })
          .catch(function(err) {
            debugger
          })
          .finally(function(a, b, c) {
            debugger
          });
      });

    });

    describe('.store', function() {

    })

  });

  function buildFakeWindowService(accessorMethod) {
    var
      localStorageSpy = jasmine.createSpyObj('localStorageSpy', [accessorMethod]),
      fakeWindow;

    fakeWindow = {
      localStorage: localStorageSpy
    };

    return fakeWindow;
  }

});