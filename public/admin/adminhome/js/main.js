// const { response } = require("express");
// const { AssignedAddOnExtensionInstance } = require("twilio/lib/rest/api/v2010/account/incomingPhoneNumber/assignedAddOn/assignedAddOnExtension");

// const { get } = require("mongoose");

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav : false
    });


    // Worldwide Sales Chart
    main($)
    revenue($)
    



    // Salse & Revenue Chart
  
    


    // // Single Line Chart
    // var ctx3 = $("#line-chart").get(0).getContext("2d");
    // var myChart3 = new Chart(ctx3, {
    //     type: "line",
    //     data: {
    //         labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
    //         datasets: [{
    //             label: "Salse",
    //             fill: false,
    //             backgroundColor: "rgba(0, 156, 255, .3)",
    //             data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // // Single Bar Chart
    // var ctx4 = $("#bar-chart").get(0).getContext("2d");
    // var myChart4 = new Chart(ctx4, {
    //     type: "bar",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(0, 156, 255, .7)",
    //                 "rgba(0, 156, 255, .6)",
    //                 "rgba(0, 156, 255, .5)",
    //                 "rgba(0, 156, 255, .4)",
    //                 "rgba(0, 156, 255, .3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // // Pie Chart
    // var ctx5 = $("#pie-chart").get(0).getContext("2d");
    // var myChart5 = new Chart(ctx5, {
    //     type: "pie",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(0, 156, 255, .7)",
    //                 "rgba(0, 156, 255, .6)",
    //                 "rgba(0, 156, 255, .5)",
    //                 "rgba(0, 156, 255, .4)",
    //                 "rgba(0, 156, 255, .3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // // Doughnut Chart
    // var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    // var myChart6 = new Chart(ctx6, {
    //     type: "doughnut",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(0, 156, 255, .7)",
    //                 "rgba(0, 156, 255, .6)",
    //                 "rgba(0, 156, 255, .5)",
    //                 "rgba(0, 156, 255, .4)",
    //                 "rgba(0, 156, 255, .3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });

    
})(jQuery);



function main($){
$.ajax({
    url:'/admin/chart1',
    method:'get',
    success:((res)=>{

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  const count = []
  res.sales.forEach((element)=>{
    count.push(element.count)
  })
  var ctx1 = document.getElementById('worldwide-sales').getContext("2d");
  var myChart1 = new Chart(ctx1, {
     type: "bar",
      data: {
          labels:months,
          datasets: [{
                  label: "Sales Count",
                  data: count,
                  backgroundColor: "rgba(0, 156, 255, .7)"
              }
          ]
          },
      options: {
          responsive: true
      }
  });
    })
})

   

}

function chart2(){
   
    fetch('/admin/chart1?day=1',{
        method:'get',
        headers:{'Content-Type' : 'application/json'}
    }).then((res)=>{
          return res.text()
    }).then(data => { return JSON.parse(data)}).then(data=>{
    
        const label = []
        const count = []
        data.report.forEach((el)=>{
            label.push(`${el._id.year}/${el._id.month}/${el._id.day}`)
            count.push(el.count)
        })
            const can = document.getElementById('can')
            can.removeChild(can.childNodes[1])
            const canv = document.createElement('canvas')
            canv.id= 'worldwide-sal'
            document.getElementById('can').appendChild(canv)
     
            const ctx1 = document.getElementById('worldwide-sal').getContext("2d");
      const myChart1 = new Chart(ctx1, {
         type: "bar",
          data: {
              labels:label,
              datasets: [{
                      label: "Sales Count",
                      data: count,
                      backgroundColor: "rgba(0, 156, 255, .7)"
                  }
              ]
              },
          options: {
              responsive: true
          }
      });
      
        })

   
}


function chart3(){
    fetch('/admin/chart1?year=1',{
        method:'get',
        headers:{'Content-Type' : 'application/json'}
    }).then((res)=>{
          return res.text()
    }).then(data => { return JSON.parse(data)}).then(data=>{
        const label = []
        const count = []
        data.Report.forEach((el)=>{
            label.push(el._id.year)
            count.push(el.count)
        })
            const can = document.getElementById('can')
            can.removeChild(can.childNodes[1])
            const canv = document.createElement('canvas')
            canv.id= 'worldwide-sale'
            document.getElementById('can').appendChild(canv)
    
            const ctx1 = document.getElementById('worldwide-sale').getContext("2d");
      const myChart1 = new Chart(ctx1, {
         type: "bar",
          data: {
              labels:label,
              datasets: [{
                      label: "Sales Count",
                      data: count,
                      backgroundColor: "rgba(0, 156, 255, .7)"
                  }
              ]
              },
          options: {
              responsive: true
          }
      });
     
        })


}

function revenue ($){
    $.ajax({
        url:'/admin/revenuechart',
        method:'get',
        success:((res)=>{
            console.log(res);
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ]
            const totalprice = []
            res.sales.forEach((el)=>{
                totalprice.push(el.totalprice)
            })
            var ctx2 = $("#salse-revenue").get(0).getContext("2d");
    var myChart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels:months,
            datasets: [
                {
                    label:" Revenue" ,
                    data: totalprice,
                    backgroundColor: "rgba(0, 156, 255, .3)",
                    fill: true
                }
            ]
            },
        options: {
            responsive: true
        }
    });

        })
    })
    
}

