# ng-loading-indicator
Angular Module to automatically display loading indicator based on type of current running HTTP requests.

# Usage

Add to app dependencies:

    angular.module('app', ['ngLoadingIndicator'])

Add HTML:

    ...
    <body>
        ...
        <div class="loading-indicator" ng-show="state()"
            ng-switch on="state()">
            <div ng-switch-when="get">
                Loading...
            </div>
            <div ng-switch-when="post">
                Saving...
            </div>
            <div ng-switch-when="post-success" class="success">
                Saving... done!
            </div>
            <div ng-switch-when="post-failed" class="failed">
                Saving... failed!
            </div>
            <div ng-switch-when="delete">
                Deleting...
            </div>
            <div ng-switch-when="delete-success" class="success">
                Deleting... done!
            </div>
            <div ng-switch-when="delete-failed" class="failed">
                Deleting... failed!
            </div>
        </div>
    </body>

Add .css (.sass) as you see fit. E.g.:

    $width: 75px
    $height: 45px

    .loading-indicator
        position: fixed
        top: 50%
        left: 0
        right: 0
        margin-top: -$height / 2
        text-align: center
        z-index: 1
        > div
            display: inline-block
            line-height: $height
            background-color: rgba(0, 0, 0, .6)
            color: white
            font-size: 14px
            font-weight: bold
            padding: 0 25px
            white-space: nowrap
            &.failed
                background-color: #a00
