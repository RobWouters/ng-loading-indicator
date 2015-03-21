module = angular.module('loading.indicator', [])

module.config ($httpProvider) ->
    # Loading hooks
    interceptor = ($q, Loading) ->
        getType = (config) ->
            if config.method == 'GET'
                'get'
            else if config.method == 'DELETE'
                'delete'
            else
                'post'

        request: (config) ->
            Loading.start getType config
            config
        response: (res) ->
            Loading.stop true, getType res.config
            res
        responseError: (rej) ->
            Loading.stop false, getType rej.config
            $q.reject rej
    $httpProvider.interceptors.push interceptor

module.factory 'Loading',
($timeout) ->
    states = [
        'post-failed'
        'post-success'
        'post'
        'delete-success'
        'delete-failed'
        'delete'
        'get'
    ]

    loading = counters: {}
    for state in states
        loading.counters[state] = 0
    loading.getState = ->
        for state in states
            if this.counters[state] > 0
                return state
    loading.start = (type) ->
        this.counters[type]++
    loading.stop = (success, type) ->
        this.counters[type]--
        if type != 'get'
            key = type + (if success then '-success' else '-failed')
            this.counters[key]++
            $timeout =>
                this.counters[key]--
            , if success then 1000 else 3000
    return loading

module.directive 'loadingIndicator',
(Loading) ->
    restrict: 'AEC'
    scope: true
    link: (scope, elem, attrs) ->
        scope.state = ->
            Loading.getState()
