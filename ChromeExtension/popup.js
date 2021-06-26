$(function() {
    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });

    $('#ShortenMe').click(function() {
        console.log('Hello from popup');
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            console.log('tabs', tabs);
            let siteUrl = tabs[0].url;
            $.ajax({
                type:"POST",
                url: "http://localhost:3000/api/",
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify({"longUrl": siteUrl}),
                success: function(data) {
                    console.log('Got data', data);
                    if(data && data.shortUrl) {
                        console.log('innn');
                        $('#shorturl').html("<a href="+data.shortUrl+" target=\"_blank\">"+data.shortUrl+"</a>");
                    }
                }
            });
        });
    });
});