$(document).ready(function() {
    var data = {
        "000D6F0003053413": {
            temp: '--',
            voc: '--',
            humidity: '--',
            noise: '--',
            light: '--',
            pressure: '--'
        },
        "000D6F0003C16E48": {
            temp: '--',
            voc: '--',
            humidity: '--',
            noise: '--',
            light: '--',
            pressure: '--'
        }
    };

    renderData = function(id) {
        $('#data .temp .value').text(data[id]['temp'].toFixed(1));
        $('#data .voc .value').text(data[id]['voc']);
        $('#data .humidity .value').text(data[id]['humidity'].toFixed(1));
        $('#data .noise .value').text(data[id]['noise'].toFixed(1));
        $('#data .light .value').text(data[id]['light'].toFixed());
        $('#data .pressure .value').text(data[id]['pressure']);
    }

    $('#select div.no-icon').click(function() {
        renderData($(this).data('id'));
        $('#data').data('id', $(this).data('id')).show();
        $('#data').find('.widget').first().text($(this).text());
        $('#select').hide();
        $('body').tmList();
    });

    $('#data .widget:first-child').click(function() {
        $('#data').hide();
        $('#select').show();
        $('body').tmList();
    });

    fetchData = function() {
        $.getJSON('data.json', function(new_data) {
            data = new_data;
            $.each(data, function(id, cube) {
                cube.voc = Math.max(cube.voc - 900, 0)*0.4 + Math.min(cube.voc, 900)
                cube.humidity = Math.min(95, Math.max(10, (cube.humidity -330*5.1)/(600/1000*5.1) + 55))
                cube.light = 10/6.0*(1+(cube.light/1024.0)*4.787*Math.exp(-(Math.pow((cube.light-2048)/400.0+1, 2)/50.0))) * (102400.0/Math.max(15, cube.light) - 25);
            });
            if ($('#data').is(':visible')) {
                renderData($('#data').data('id'));
            }
        });
    }
    fetchData();

    setInterval(function() {
        fetchData();
    }, 10000);
});
