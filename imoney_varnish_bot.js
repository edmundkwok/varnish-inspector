$(document).ready(function(){

  validateInput();

  chrome.storage.sync.get({
    hosts: []
  }, function(options){
    var $checkbox = $('<div class="checkbox"><label><input type="checkbox" name="host[]"></input></label></div>');
    console.log(options);
    if (options.hosts.length) {
      for (var index in options.hosts) {
        var $checkboxCopy = $checkbox.clone();
        var host = options.hosts[index].host;
        var label = options.hosts[index].label;

        $checkboxCopy.find('input').attr('value', host);
        $checkboxCopy.find('label').append(label);
        $checkboxCopy.appendTo('#checkbox-wrapper');
      }
    }
  });

  $('#varnish-ban').submit(function(e){
    e.preventDefault();

    $('input[name*=host]:checked').each(function(){

      var host = $(this).val();
      var operator = $('#operator').val();
      var parameter = '/' + $('#parameter').val();

      var command = 'req.http.host == "' + host + '" && req.url ' + operator + ' "' + parameter + '"';

      // Inspired from https://gist.github.com/mshmsh5000/7450623.
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open('BAN', 'http://' + host, true);
      xmlHttp.setRequestHeader("X-Purge-Key", "MYSUPERSECRETKEY");
      xmlHttp.setRequestHeader("X-Ban-Host", host);
      xmlHttp.setRequestHeader("X-Ban-Operator", operator);
      xmlHttp.setRequestHeader("X-Ban-Parameter", parameter);

      $("#ban-status").append('Sending: ' + command + '...');

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
          if (xmlHttp.status === 200) {
            $("#ban-status").append(' Done!<br/>');
          }
          else {
            $("#ban-status").append(' Failed<br/>' + xmlHttp.responseText);
          }
        }
      };
      xmlHttp.send(null);
    });
  });

  $(document).on('change', 'input[name*=host]', function(){
    validateInput();
  });

  $('#operator').change(function(){
    checkDanger();
  });

  $('#parameter').keyup(function(){
    validateInput();
    checkDanger();
  });

  function validateInput() {
    if ($('input[name*=host]:checked').length) {
      $('#submit').removeAttr('disabled');
      return true;
    }
    else {
      $('#submit').attr('disabled', 'disabled');
      return false;
    }
  }

  function checkDanger() {
    if ($('#operator').val() == '~' && !$('#parameter').val()) {
      $('#danger-text').fadeIn();
    }
    else {
      $('#danger-text').fadeOut();
    }
  }

});
