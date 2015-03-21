(function() {
  var module;

  module = angular.module('loading.indicator', []);

  module.config(function($httpProvider) {
    var interceptor;
    interceptor = function($q, Loading) {
      var getType;
      getType = function(config) {
        if (config.method === 'GET') {
          return 'get';
        } else if (config.method === 'DELETE') {
          return 'delete';
        } else {
          return 'post';
        }
      };
      return {
        request: function(config) {
          Loading.start(getType(config));
          return config;
        },
        response: function(res) {
          Loading.stop(true, getType(res.config));
          return res;
        },
        responseError: function(rej) {
          Loading.stop(false, getType(rej.config));
          return $q.reject(rej);
        }
      };
    };
    return $httpProvider.interceptors.push(interceptor);
  });

  module.factory('Loading', function($timeout) {
    var loading, state, states, _i, _len;
    states = ['post-failed', 'post-success', 'post', 'delete-success', 'delete-failed', 'delete', 'get'];
    loading = {
      counters: {}
    };
    for (_i = 0, _len = states.length; _i < _len; _i++) {
      state = states[_i];
      loading.counters[state] = 0;
    }
    loading.getState = function() {
      var _j, _len1;
      for (_j = 0, _len1 = states.length; _j < _len1; _j++) {
        state = states[_j];
        if (this.counters[state] > 0) {
          return state;
        }
      }
    };
    loading.start = function(type) {
      return this.counters[type]++;
    };
    loading.stop = function(success, type) {
      var key;
      this.counters[type]--;
      if (type !== 'get') {
        key = type + (success ? '-success' : '-failed');
        this.counters[key]++;
        return $timeout((function(_this) {
          return function() {
            return _this.counters[key]--;
          };
        })(this), success ? 1000 : 3000);
      }
    };
    return loading;
  });

  module.directive('loadingIndicator', function(Loading) {
    return {
      restrict: 'AEC',
      scope: true,
      link: function(scope, elem, attrs) {
        return scope.state = function() {
          return Loading.getState();
        };
      }
    };
  });

}).call(this);
