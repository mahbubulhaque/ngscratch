export default function navbar() {
    return {
      restrict: 'E',
      scope: {
        name: '='
      },
      template: require('./navbar.html')
    }
  }