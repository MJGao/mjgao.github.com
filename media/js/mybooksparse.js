$(document).ready(function(){
 var mybooks = $("#mybooks");
          mybooks.empty();

$.getJSON("http://api.douban.com/people/84894352/collection?cat=book&status=read&max-results=40&alt=xd&callback=?", function(results){ 

          $("#books_total").html(results['opensearch:totalResults'].$t);

         
          
          
         
          
          for(var i=0;i<results.entry.length;i++){
               //alert(results.entry[i].id.$t);
               //alert(results.entry[i]['db:subject'].title.$t);
               //alert(results.entry[i]['db:subject']['db:attribute']);
               //alert(results.entry[i]['db:subject'].link[2])['@href'];

              mybooks.append("<dl id='mybooks_list'class='mybooks_list"+i+"'></dl>");
               $(".mybooks_list"+i).append("<dt id='mbook' class='mbook'"+i+"><a href='"+results.entry[i]['db:subject'].link[1]['@href']+"'><img src= '"+results.entry[i]['db:subject'].link[2]['@href']+"'/></a></dt>");
               $(".mybooks_list"+i).append("<dd id='b_t'><a href='"+results.entry[i]['db:subject'].link[1]['@href']+"'>"+results.entry[i]['db:subject'].title.$t+"</a></dd>");
               $(".mybooks_list"+i).append("<dd id='b_au' class='bau'><a>作者:"+results.entry[i]['db:subject']['db:attribute'][2]['$t']+"</a></dd>");
             
         }
          

          
       });  

});
