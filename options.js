$(document).ready(function(){

  var $row = $('<tr><td><input type="text" class="form-control ban-host" placeholder="www.example.com"></input></td><td><input type="text" class="form-control ban-label" placeholder="Example"></input></td><td><a href="#" class="delete-host"><i class="glyphicon glyphicon-remove-sign"></i></a></td></tr>');

  $('table').on('focus', 'tr:last-child .ban-label', function(){
    var index = $('tbody tr').length;
    addRow(index);
  });
  $('table').on('click', '.delete-host', function(){
    $(this).parents('tr').remove();
    resetIds();
  });

  var hosts = [];
  var options = [];
  chrome.storage.sync.get({
    hosts: []
  }, function(options){
    options = options;
    if (options.hosts.length) {
      for (var index in options.hosts) {
        var host = options.hosts[index].host;
        var label = options.hosts[index].label;
        var newIndex = parseInt(index, 10) + 1;

        addRow(newIndex);
        $('#ban-host-' + newIndex).val(host);
        $('#ban-label-' + newIndex).val(label);
      }
    }
    addRow($('tbody tr').length + 1);
  });

  $('#varnish-ban').submit(function(e){
    e.preventDefault();

    $('tbody tr').each(function(){
      var host = $(this).find('.ban-host').val();
      var label = $(this).find('.ban-label').val();

      if (host && label) {
        hosts.push({
          host: host,
          label: label
        });
      }
    });

    chrome.storage.sync.set({
      hosts: hosts
    }, function(){
      $('.alert').fadeIn();
      setTimeout(function(){
        $('.alert').fadeOut();
      }, 2000);
    });
  });

  function addRow(index) {
    var $rowCopy = $row.clone();
    $rowCopy.find('.ban-host').attr('id', 'ban-host-' + index);
    $rowCopy.find('.ban-label').attr('id', 'ban-label-' + index);
    $rowCopy.appendTo('tbody');
  }

  function resetIds() {
    var index = 1;
    $('tbody tr').each(function(){
      var $host = $(this).find('.ban-host');
      var $label = $(this).find('.ban-label');

      $host.attr('id', 'ban-host-' + index);
      $label.attr('id', 'ban-label-' + index);

      index++;
    });
  }
});
