/*
 * Copyright (c) 2011, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/*
  * This is a simple jQuery Mobile-based app that uses the Force.com REST API.
  * See mobile.page for code required to run this in Visualforce
  * See mobile.html for code required to run this on your own server
  */

function errorCallback(jqXHR){
    alert(jqXHR.statusText + ": " + jqXHR.responseText);
}

function addClickListeners() {
	$j('resbutton').click(function(e)
	{
		alert("resBUTTON");
		/*setButtonText('#resbutton', 'Authentication');
		var loginUrl = 'https://login.salesforce.com/';
		var clientId = '3MVG9Y6d_Btp4xp5Rp4JEHNVNbuXM6Lq7obrs4v8Wo2sZ_8UcAcCZ6OnfZqEgZ4EiHMVSY9yjNawz5GMyVnVh';
		var client_secret = '5284286655590927957';
		var redirectUri = 'https://login.salesforce.com/services/oauth2/success';
		var username ='ayyappak@axxonet.com'
		var password ='axxonet#9977WQPRomIXfTJa8xhx7PQG8j3YK'
		var url = this.loginUrl + '/services/oauth2/token';
        $j.ajax({
            type: 'POST',
            contentType:"application/json",
            url: "https://na14.salesforce.com/services/oauth2/token",
            data: JSON.stringify('grant_type=password&client_id=' + this.clientId + '&client_secret=' + this.client_secret + '&username=' + this.username+ '&password=' + this.password),
            success: function(response)
            {
            	alert("SUCCESS");
            	setButtonText('#resbutton', 'Authentication');
            },
            error: function(response)
            {
            	alert("Failure");
            	//$j.mobile.pageLoading("response");
            	setButtonText('#resbutton', 'Fail');
            },
                        
        });*/
	}		
	);
   /* $j('#newbtn').click(function(e) {
        // Show the 'New Account' form
        e.preventDefault();
        $j('#accountform')[0].reset();
        $j('#accformheader').html('New Case');
        setButtonText('#actionbtn', 'Create');
        $j('#actionbtn').unbind('click.btn').bind('click.btn', createHandler);
        $j.mobile.changePage('#editpage', "slide", false, true);
    });*/

   /* $j('#deletebtn').click(function(e) {
        // Delete the account
        e.preventDefault();
        $j.mobile.pageLoading();
        client.del('Case', $j('#accountdetail').find('#Id').val()
        ,
        function(response) {
        	getVacations(function() {
                $j.mobile.pageLoading(true);
                $j.mobile.changePage('#mainpage', "slide", true, true);
            });
        }, errorCallback);
    });*/

    $j('#editbtn').click(function(e) {
        // Get account fields and show the 'Edit Account' form
        e.preventDefault();
        $j.mobile.pageLoading();
        client.retrieve("Case", $j('#accountdetail').find('#Id').val()
        , "Measures_completed__c,Id",
        function(response) {
            $j('#accountform').find('input').each(function() {
                $j(this).val(response[$j(this).attr("name")]);
            });
            /*$j('#accformheader').html('Edit Case');*/
            setButtonText('#actionbtn', 'Update');
            $j('#actionbtn')
            .unbind('click.btn')
            .bind('click.btn', updateHandler);
            $j.mobile.pageLoading(true);
            $j.mobile.changePage('#editpage', "slide", false, true);
        }, errorCallback);
    });
}

// Populate the Products list and set up click handling
function getAccounts(callback) {
    $j('#productlist').empty();
    client.query("SELECT Id, Name, Industry FROM Account"
    ,
    function(response) {
        $j.each(response.records,
        function() {
            var id = this.Id;
            $j('<li></li>')
            .hide()
            .append('<a href="#"><h2>' + this.Name + ' - Industry : $' + this.Industry+ '</h2></a>')
            .click(function(e) {
                e.preventDefault();
                $j.mobile.pageLoading();
                // We could do this more efficiently by adding Industry and
                // TickerSymbol to the fields in the SELECT, but we want to
                // show dynamic use of the retrieve function...
                client.retrieve("Account", id, "Name,Id,Industry"
                ,
                function(response) {
                    $j('#Name').html(response.Name);
                    $j('#Industry').html(response.Industry);
                    $j('#Id').val(response.Id);
                    $j.mobile.pageLoading(true);
                    $j.mobile.changePage('#detailpage', "slide", false, true);
                }, errorCallback);
            })
            .appendTo('#productlist')
            .show();
        });

        $j('#productlist').listview('refresh');

        if (typeof callback != 'undefined' && callback != null) {
            callback();
        }
    }, errorCallback);
}
function getVacations(callback) {
    $j('#productlist').empty();
    var userid = $j('#useridform').find('#userid').val()
    client.query("SELECT Id, Account.Name,CreatedDate,Priority,How_many_measures_in_this_request__c,Measures_completed__c FROM Case Where Status !='Closed' and Reason='Bids & Measures' and Measures_assigned_to__c='"+userid+"' ORDER BY CreatedDate"
    ,
    function(response) {
        $j.each(response.records,
        function() {
            var id = this.Id;
			var parts = this.CreatedDate.split('T');
			var date =  parts[0].split('-');
			var timeparts = parts[1];
			var time = timeparts.split(":");
            $j('<li></li>')
            .hide()
            .append('<a href="#"><h2>' + this.Account.Name + ' <br>' + date[1]+"/"+date[2]+"/"+date[0]+" "+time[0]+":"+time[1]+ ' <br> Priority :' + this.Priority+ '<br> Measures assigned:'+this.How_many_measures_in_this_request__c+'<br> Measures completed:'+this.Measures_completed__c +'</h2></a>')
            .click(function(e) {
                e.preventDefault();
                $j.mobile.pageLoading();
                // We could do this more efficiently by adding Industry and
                // TickerSymbol to the fields in the SELECT, but we want to
                // show dynamic use of the retrieve function...
                client.retrieve("Case", id, "Id,Account.Name,Priority,Origin,Subject,Description,CreatedDate,Reason,ClosedDate,Status,Type,How_many_bids_in_this_request__c,Bids_assigned_to__c,Bids_completed__c,Bid_needs_information_from_purchasing__c,Bid_needs_information_from_AE__c,How_many_measures_in_this_request__c,Measures_assigned_to__c,Measures_completed__c,Includes_special_order_products__c,Includes_common_area__c"
                ,
                function(response) {
					var parts = response.CreatedDate.split('T');
					var date =  parts[0].split('-');
					var timeparts = parts[1];
					var time = timeparts.split(":");
                    $j('#Name').html(response.Account.Name);
                    $j('#Priority').html(response.Priority);
                    $j('#Origin').html(response.Origin);
                    $j('#Subject').html(response.Subject);
                    $j('#Description').html(response.Description);
                    $j('#CreatedDate').html(date[1]+"/"+date[2]+"/"+date[0]+" "+time[0]+":"+time[1]);
                    $j('#Reason').html(response.Reason);
                    $j('#ClosedDate').html(response.ClosedDate);
                    $j('#Status').html(response.Status);
                    $j('#Type').html(response.Type);
                    $j('#How_many_bids_in_this_request__c').html(response.How_many_bids_in_this_request__c);
                    $j('#Bids_assigned_to__c').html(response.Bids_assigned_to__c);
                    $j('#Bids_completed__c').html(response.Bids_completed__c);
                    $j('#Bid_needs_information_from_purchasing__c').html(response.Bid_needs_information_from_purchasing__c);
                    $j('#Bid_needs_information_from_AE__c').html(response.Bid_needs_information_from_AE__c);
                    $j('#How_many_measures_in_this_request__c').html(response.How_many_measures_in_this_request__c);
                    /*$j('#Measures_assigned_to__c').html(response.Measures_assigned_to__c);*/
                    $j('#Measures_completed__c').html(response.Measures_completed__c);
                    $j('#Includes_special_order_products__c').html(response.Includes_special_order_products__c);
                    $j('#Includes_common_area__c').html(response.Includes_common_area__c);
                    $j('#Id').val(response.Id);
                    $j.mobile.pageLoading(true);
                    $j.mobile.changePage('#detailpage', "slide", false, true);
                }, errorCallback);
            })
            .appendTo('#productlist')
            .show();
        });

        $j('#productlist').listview('refresh');

        if (typeof callback != 'undefined' && callback != null) {
            callback();
        }
    }, errorCallback);
}
// Gather fields from the account form and create a record
function createHandler(e) {
    e.preventDefault();
    var accountform = $j('#accountform');
    var fields = {};
    accountform.find('input').each(function() {
        var child = $j(this);
        if (child.val().length > 0 && child.attr("name") != 'Id') {
            fields[child.attr("name")] = child.val();
        }
    });
    $j.mobile.pageLoading();
    client.create('Case', fields,
    function(response) {
        getVacations(function() {
            $j.mobile.pageLoading(true);
            $j.mobile.changePage('#mainpage', "slide", true, true);
        });
    }, errorCallback);
}

// Gather fields from the account form and update a record
function updateHandler(e) {
    e.preventDefault();
    var accountform = $j('#accountform');
    var fields = {};
    accountform.find('input').each(function() {
        var child = $j(this);
        if (child.val().length > 0 && child.attr("name") != 'Id') {
            fields[child.attr("name")] = child.val();
        }
    });
    $j.mobile.pageLoading();
    client.update('Case', accountform.find('#Id').val(), fields
    ,
    function(response) {
        getVacations(function() {
            $j.mobile.pageLoading(true);
            $j.mobile.changePage('#mainpage', "slide", true, true);
        });
    }, errorCallback);
}

// Ugh - this is required to change text on a jQuery Mobile button
// due to the way it futzes with things at runtime
function setButtonText(id, str) {
    $j(id).html(str).parent().find('.ui-btn-text').text(str);
}