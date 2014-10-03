'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql', 'debounce'])

.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleSideMenu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
})

.controller('WMICtrl', function($scope,$state, Nols) {

})

.controller('FirstResponderCtrl', function($scope, $state, $location,
                                           $stateParams,$timeout,
                                           Responders, Soaps, Nols,uiState) {
  //Nols.cutLifeLine();
  $scope.mySoaps = function() {$state.go('soaps');}
  $scope.termsPage = function() {$state.go('terms');}
  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT', 'Other'];
  $scope.$location = $location;

  //INTRO LOGIC
  Responders.createResponderTable();
    Responders.all(function(err,responders){
    if(!responders) {
      Responders.saveResponder({},function(err,responder){
        $scope.responder = responder;
        return $scope.responder;
      })
    }else{
      Responders.get(function(err,responder) {
        if(responder !== null){
          $scope.responder = responder;
          if($scope.$location.path() == '/' && responder.acceptedTerms === 'true') {
            $scope.mySoaps();
          }
        }else {
          return;
        }
      })
    }
    })

  $scope.acceptAndSave = function(responder) {
    Responders.updateResponder('acceptedTerms',responder.id,true);
    $scope.mySoaps();
  };

  $scope.monitorResponderChange = function(responder, responderVal, attrElem) {
    console.log(responderVal)
    var kindElem = attrElem,kindId = responder.id,kindVal = responderVal;
    Responders.updateResponder(kindElem,kindId,kindVal);
  }

})

.controller('SoapCtrl', function($scope, $state, $stateParams, $ionicPopup,
                                 $ionicModal, $timeout, $location,
                                 Soaps, Responders, Nols){
  "use strict";

  Soaps.createSoapTable();

  Responders.get(function(err,responder){
    $scope.responder = responder;
    if(responder){
      if($state.includes('soaps')){
      Soaps.getLast(function(err,lastSoap){
        if(lastSoap === null || lastSoap.starterFlag === 'true'){
          Soaps.saveNewSoap({},responder,function(err,starterSoap){
            $scope.starterSoap = starterSoap.id;
          })
        }else {
          $scope.starterSoap = lastSoap.id;
        }
      })
      }
    }
  })

  Soaps.all('mySoaps',function(err,soaps){
    $scope.soaps = soaps;
    //display only soaps where starter flag === true; handled on factory
  })

  $scope.moveItem = function(soap,fromIndex,toIndex){
    $scope.soaps.splice(fromIndex, 1);
    $scope.soaps.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function(soapId) {
    var confirmDelete = $ionicPopup.confirm({
      title: 'SOAP ID ' + soapId,
      template: 'Are you sure you want to delete this SOAP?'
    })
    confirmDelete.then(function(res){
      if(res){
        Soaps.deleteSoap(soapId);
        $scope.soaps.splice($scope.soaps.indexOf(soapId), 1)
      }else {
        return;
      }
    })
  }

  $scope.data = {
    showDelete: false
  };

  $scope.cancelSoap = function(soap){
    var confirmPopup = $ionicPopup.confirm({
      template: 'Delete Soap or view all soaps',
      buttons: [
        {text: 'Delete Soap',
        type: 'button-positive',
         onTap: function(){
           Soaps.deleteSoap(soap.id);
           $state.go('soaps');
         }
        },
        {text: 'My Soaps',
        type: 'button-soaps',
         onTap: function(){
           $state.go('soaps');
         }
        }
      ]
    });
  }


  //Nols.cutLifeLine();

  // Modal 1
     $ionicModal.fromTemplateUrl('modal-1.html', {
       id: '1', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal1 = modal;
     });

     // Modal 2
     $ionicModal.fromTemplateUrl('modal-2.html', {
       id: '2', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal2 = modal;
     });

         // Modal 3
     $ionicModal.fromTemplateUrl('modal-3.html', {
       id: '3', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal3 = modal;
     });

             // Modal 4
     $ionicModal.fromTemplateUrl('modal-4.html', {
       id: '4', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal4 = modal;
     });

                 // Modal 5
     $ionicModal.fromTemplateUrl('modal-5.html', {
       id: '5', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal5 = modal;
     });

     $scope.openModal = function(index) {
       if(index == 1) $scope.oModal1.show();
       if(index == 2) $scope.oModal2.show();
       if(index == 3) $scope.oModal3.show();
       if(index == 4) $scope.oModal4.show();
       if(index == 5) $scope.oModal5.show();

     };

     $scope.closeModal = function(index) {
       if(index == 1) $scope.oModal1.hide();
       if(index == 2) $scope.oModal2.hide();
       if(index == 3) $scope.oModal3.hide();
       if(index == 4) $scope.oModal4.hide();
       if(index == 5) $scope.oModal5.hide();

     };

     $scope.$on('modal.shown', function(event, modal) {
       console.log('Modal ' + modal.id + ' is shown!');
     });

     $scope.$on('modal.hidden', function(event, modal) {
       console.log('Modal ' + modal.id + ' is hidden!');
     });

     // Cleanup the modals when we're done with them (i.e: state change)
     // Angular will broadcast a $destroy event just before tearing down a scope
     // and removing the scope from its parent.
     $scope.$on('$destroy', function() {
       console.log('Destroying modals...');
       $scope.oModal1.remove();
       $scope.oModal2.remove();
       $scope.oModal3.remove();
       $scope.oModal4.remove();
       $scope.oModal5.remove();
     });
 // end modals
     $scope.shareSOAP = function(soap) {
     var htmlbody = '<h2>Location</h2>'+
     '<strong>Date of Incident</strong>: ' + soap.incidentDate + '<br/>' +
     '<strong>Location</strong>: ' + soap.incidentLocation + '<br/>' +
     '<strong>Coordinates</strong>: ' + soap.incidentLat + ', ' + soap.incidentLon + '<br/>' +
     '<strong>Responder</strong>: ' + soap.responderFirstName + ' ' + soap.responderLastName + ', ' + soap.responderTrainingLevel + '<br/>' +
     '<h2>Subjective</h2>'+
     '<strong>Initials</strong>: ' + soap.patientInitials + '<br/>' +
     '<strong>DOB</strong>: ' + soap.patientDob + '<br/>' +
     '<strong>Age</strong>: ' + soap.patientAge + '<br/>' +
     '<strong>Sex</strong>: ' + soap.patientGender + '<br/>' +
     '<h3>Chief Complaint</h3>'+
     '<p>' + soap.patientComplaint + '</p>' +
     '<strong>Onset</strong>: ' + soap.patientOnset + '<br/>' +
     '<strong>Provokes/Palliates</strong>: ' + soap.patientPPalliates + '<br/>' +
     '<strong>Quality</strong>: ' + soap.patientQuality + '<br/>' +
     '<strong>Radiation/Region/Referred</strong>: ' + soap.patientRadiates + '<br/>' +
     '<strong>Severity</strong>: ' + soap.patientSeverity + ' out of 10<br/>' +
     '<strong>Time of Onset</strong>: ' + soap.patientTime + '<br/>' +
     '<h3>MOI/HPI</h3>'+
     '<p>' + soap.patientHPI + '</p>' +
     '<strong>Suspected Spinal MOI</strong>: ' + soap.patientSpinal + '<br/>' +
     '<h2>Objective</h2>'+
     '<h3>General</h3>'+
     '<strong>Patient Position When Found</strong>: ' + soap.patientFound + '<br/>' +
     '<strong>Patient Exam</strong>: ' + soap.patientExamReveals + '<br/>' +
     '<h3>Vital Signs</h3>'+
     '<p>Vital Signs coming soon</p>'+
     '<h3>Patient History</h3>'+
     '<strong>Symptoms</strong>: ' + soap.patientSymptoms + '<br/>' +
     '<strong>Allergies</strong>: ' + soap.patientAllergies + '<br/>' +
     '<strong>Medications</strong>: ' + soap.patientMedications + '<br/>' +
     '<strong>Pertinent Medical History</strong>: ' + soap.patientMedicalHistory + '<br/>' +
     '<strong>Last Intake/Output</strong>: ' + soap.patientLastIntake + '<br/>' +
     '<strong>Events Leading up to Injury/Illness</strong>: ' + soap.patientEventsForCause + '<br/>' +
     '<h2>Assessment</h2>'+
     '<p>' + soap.patientAssessment + '</p>' +
     '<h2>Plan</h2>'+
     '<p>' + soap.patientPlan + '</p>' +
     '<strong>Anticipated Problems</strong>: ' + soap.patientAnticipatedProblems + '<br/>';

      window.plugin.email.open({
        to:      ['rogers@eyebytesolutions.com'],
        cc:      ['vehr@eyebytesolutions.com'],
        bcc:     [''],
        subject: 'SOAP Note: Test',
        body:    htmlbody,
        isHtml:  true
     });
    };

})

//SOAP OVERVIEW TAB
.controller('SoapOverviewCtrl', function($scope,$state,$stateParams,Soaps,Responders,Nols){
  Soaps.get($stateParams.soapId, function(err, soapOverview){
    if(soapOverview.starterFlag === 'false') {
      Soaps.updateSoap('starterFlag',soapOverview.id,true);
    }
    $scope.soapOverview = soapOverview;
  })

  $scope.monitorSoapOverviewChange = function(soap,soapVal,attrElem){
    var kindElem = attrElem,kindId = soap.id,kindVal = soapVal;
    Soaps.updateSoap(kindElem,kindId,kindVal);
  }

  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT', 'Other'];

  //AUTO EXPAND BOXES
  $scope.expandText = function(obj){
  var valueID = obj.target.attributes.id.value;
  var element = document.getElementById(valueID);
  element.style.height =  element.scrollHeight + "px";}

  //GEOLOCATION
  $scope.showPosition = function(position){
    $scope.soapOverview.incidentLat = position.coords.latitude;
    $scope.soapOverview.incidentLon = position.coords.longitude;
    $scope.apply();
  }
  if(!navigator.geolocation){
    document.getElementById('GeoLocationBtnInner').innerHTML = "GPS Unavailable";
    document.getElementById("coordsBtn").className = "";
    document.getElementById("coordsBtn").className = "button button-block button-calm margin";
  }
  $scope.getLocation = function(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition($scope.showPosition);
      document.getElementById('GeoLocationBtnInner').innerHTML = "Reset Coordinates";
      document.getElementById("coordsBtn").className = "";
      document.getElementById("coordsBtn").className = "button button-block button-calm margin";
    }else {
      alert('Sorry, this feature is currently unavailable');
    }
  }

})

//SOAP SUBJECTIVE TAB
.controller('SoapSubjectiveCtrl', function($scope,$state,$stateParams,Soaps,Responders,Nols){
  Soaps.get($stateParams.soapId, function(err,soapSubjective){
    $scope.soapSubjective = soapSubjective;
  })

  $scope.monitorSoapSubjectiveChange = function(soap,soapVal,attrElem){
    var kindElem = attrElem,kindId = soap.id,kindVal = soapVal;
    Soaps.updateSoap(kindElem,kindId,kindVal);
  }

  var range = function(i){
    return i ? range(i-1).concat(i):[];
  }

  $scope.genders = [
    {name:'Male',value:'M'},
    {name:'Female',value:'F'},
    {name:'Transgender',value:'T'}
  ];
  $scope.onsets = ['Sudden', 'Gradual'];
  $scope.qualities = ['Aching', 'Burning',
                      'Cramping', 'Crushing',
                      'Dull Pressure', 'Sharp',
                      'Squeezing', 'Stabbing',
                      'Tearing', 'Tight', 'Other'];
  $scope.severities = range(10);
  $scope.spinals = ['Yes', 'No'];

  $scope.findAge = function (date) {
    //SIT THIS INSIDE MONITOR SOAP SUB CHANGE
    var birthDay = $scope.soapSubjective.patientDob,
      DOB = new Date(birthDay),
      today = new Date(),
      age = today.getTime() - DOB.getTime();
      age = Math.floor(age / (1000 * 60 * 60 * 24 * 365.25));
      $scope.soapSubjective.patientAge = age;
  }

})

//SOAP OBJECTIVE TAB
.controller('SoapObjectiveCtrl', function($scope,$state,$stateParams,Soaps,Responders,Vitals,Nols){
  Vitals.createVitalTable();
  Soaps.get($stateParams.soapId, function(err,soapObjective){
    $scope.soapObjective = soapObjective;
    Vitals.all(soapObjective.id, function(err,soapVitals,recentSoapVitals){
      $scope.soapVitals = soapVitals;
      $scope.recentSoapVitals = recentSoapVitals;
      //hand on services
    })
    Vitals.getLast(function(err,lastVital){
      if(lastVital === null || lastVital.starterFlag === 'true'){
        Vitals.saveNewVital({},soapObjective.id,function(err,starterVital){
          $scope.starterVital = starterVital;
        })
      }else {
        $scope.starterVital = lastVital;
      }
    })
  })

  $scope.monitorSoapObjectiveChange = function(soap,soapVal,attrElem){
    var kindElem = attrElem,kindId = soap.id,kindVal = soapVal;
    Soaps.updateSoap(kindElem,kindId,kindVal);
  }

})

//SOAP A-P TAB
.controller('SoapAPCtrl', function($scope,$state,$stateParams,Soaps,Responders, Nols){
  Soaps.get($stateParams.soapId, function(err,soapAP){
    $scope.soapAP = soapAP;
  })

  $scope.monitorSoapAPChange = function(soap,soapVal,attrElem){
    var kindElem = attrElem,kindId = soap.id,kindVal = soapVal;
    Soaps.updateSoap(kindElem,kindId,kindVal);
  }
})

//SOAP REVIEW TAB
.controller('SoapReviewCtrl', function($scope,$state,$stateParams,Soaps,Responders,Vitals,Nols){
  Soaps.get($stateParams.soapId, function(err,soapReview){
    $scope.soapReview = soapReview;
    Vitals.all(soapReview.id, function(err,soapVitals,recentSoapReviewVitals){
      $scope.recentSoapReviewVitals = recentSoapReviewVitals;
      $scope.recentSoapReviewVitals = recentSoapReviewVitals;
      //hand on services
    })
  })
})

.controller('SoapImgCtrl', function($scope,$stateParams,$state,Camera,Soaps) {
  Soaps.get($stateParams.soapId, function(err,soapImg){
    $scope.soapImg = soapImg;
  })
  Camera.createImgTable();
  Camera.all(function(err,imgs){
   $scope.imgs = imgs;
  })

  $scope.takeNewImg = function() {
    Camera.getNewImg(function(err,imgAttr){
      Camera.saveNewImg(imgAttr);
    })
  }

})


.controller('SoapDetailCtrl', function($scope,$state,$stateParams,Soaps,Responders,Vitals,Nols){
  Soaps.get($stateParams.soapId, function(err,soapDetail){
    $scope.soapDetail = soapDetail;
  })
})

.controller('VitalAllCtrl', function($scope,$state,$stateParams,Vitals,Soaps,Nols){

    Vitals.getLast(function(err,lastVital){
      if(lastVital === null || lastVital.starterFlag === 'true'){
        Vitals.saveNewVital({},$stateParams.soapId,function(err,starterVital){
          $scope.starterVital = starterVital;
        })
      }else {
        $scope.starterVital = lastVital;
      }
    })


  Vitals.getAll($stateParams.soapId, function(err, soapVitals){
    $scope.soapVitalsId = $stateParams.soapId;
    $scope.soapVitals = soapVitals;
  })

  $scope.timeValue = 0;
  function countdown(){
    $scope.timeValue++;
    $scope.timeout = $timeout(countdown,1000);
  };
  $scope.start = function(){
    countdown();
    $scope.play = true;
    $scope.pause = false;
  }
  $scope.stop = function(){
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
  }
  $scope.reset = function(){
    $scope.timeValue = 0;
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
  }
})

.controller('VitalDetailCtrl', function($scope,$state,$stateParams,Vitals){
  Vitals.get($stateParams.vitalId, function(err, vitalDetail){
    if(vitalDetail.starterFlag === 'false'){
      Vitals.updateVital("starterFlag",vitalDetail.id,true);
    }
    $scope.vitalDetail = vitalDetail;
  })

  $scope.pupils = ['PERRL', 'Not PERRL'];
  $scope.BPtakens = ['Taken', 'Palpated'];
  $scope.BPpulses = ['Present', 'Weak', 'Absent'];
  $scope.SKINmoists = ['Dry', 'Moist', 'Wet'];
  $scope.SKINtemps = ['Warm', 'Cool', 'Hot'];
  $scope.SKINcolors = ['Pink', 'Pale', 'Red'];
  $scope.RESPrythms = ['Regular', 'Irregular'];
  $scope.RESPqualities = ['Easy', 'Shallow', 'Labored'];
  $scope.HEARTqualities = ['Strong', 'Weak', 'Bounding'];
  $scope.HEARTrythms = ['Regular', 'Irregular'];
  $scope.tempDegrees = [
        {name:'°Fahrenheit', value:'°F'},
        {name:'°Celsius', value:'°C'}
      ];
  $scope.LORs = [
        {name:'Awake & Oriented x 4', value:'AOx4'},
        {name:'Awake & Oriented x 3', value:'AOx3'},
        {name:'Awake & Oriented x 2', value:'AOx2'},
        {name:'Awake & Oriented x 1', value:'AOx1'},
        {name:'Awake & Oriented x 0', value:'AOxO'},
        {name:'Verbal Stimulus', value:'V'},
        {name:'Painful Stimulus', value:'P'},
        {name:'Unresponsive', value:'U'}
      ];

  $scope.monitorVitalChange = function(vital,vitalVal,attrElem){
    var kindElem = attrElem,kindId = vital.id,kindVal = vitalVal;
    Vitals.updateVital(kindElem,kindId,kindVal);
  }

  $scope.timeValue = 0;

  $scope.timeValue = 0;
  function countdown(){
    $scope.timeValue++;
    $scope.timeout = $timeout(countdown,1000);
  };
  $scope.start = function(){
    countdown();
    $scope.play = true;
    $scope.pause = false;
  }
  $scope.stop = function(){
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
  }
  $scope.reset = function(){
    $scope.timeValue = 0;
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
  }


})






/*

  //$scope.dt = new Date();

//modals. DRY up, and seperate templates later.
 // Modal 1
    $ionicModal.fromTemplateUrl('modal-1.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });

    // Modal 2
    $ionicModal.fromTemplateUrl('modal-2.html', {
      id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal2 = modal;
    });

        // Modal 3
    $ionicModal.fromTemplateUrl('modal-3.html', {
      id: '3', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal3 = modal;
    });

            // Modal 4
    $ionicModal.fromTemplateUrl('modal-4.html', {
      id: '4', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal4 = modal;
    });

                // Modal 5
    $ionicModal.fromTemplateUrl('modal-5.html', {
      id: '5', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal5 = modal;
    });

    $scope.openModal = function(index) {
      if(index == 1) $scope.oModal1.show();
      if(index == 2) $scope.oModal2.show();
      if(index == 3) $scope.oModal3.show();
      if(index == 4) $scope.oModal4.show();
      if(index == 5) $scope.oModal5.show();

    };

    $scope.closeModal = function(index) {
      if(index == 1) $scope.oModal1.hide();
      if(index == 2) $scope.oModal2.hide();
      if(index == 3) $scope.oModal3.hide();
      if(index == 4) $scope.oModal4.hide();
      if(index == 5) $scope.oModal5.hide();

    };

    $scope.$on('modal.shown', function(event, modal) {
      console.log('Modal ' + modal.id + ' is shown!');
    });

    $scope.$on('modal.hidden', function(event, modal) {
      console.log('Modal ' + modal.id + ' is hidden!');
    });

    // Cleanup the modals when we're done with them (i.e: state change)
    // Angular will broadcast a $destroy event just before tearing down a scope
    // and removing the scope from its parent.
    $scope.$on('$destroy', function() {
      console.log('Destroying modals...');
      $scope.oModal1.remove();
      $scope.oModal2.remove();
      $scope.oModal3.remove();
      $scope.oModal4.remove();
      $scope.oModal5.remove();
    });
// end modals

})*/

// coundown controls.
.controller('VitalCtrl', function($scope, $state, $stateParams, $timeout, Vitals, Soaps) {
"use strict";


  $scope.timeValue = 0;

  function countdown() {
    $scope.timeValue++;
    $scope.timeout = $timeout(countdown, 1000);
  };

  $scope.start = function() {
    countdown();
    $scope.play = true;
    $scope.pause = false;
  };

  $scope.stop = function() {
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
  };

  $scope.reset = function() {
	$scope.timeValue = 0;
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
  };
})

.controller('VitalNewCtrl', function($scope, $state, $stateParams, Vitals) {
  //LOOK AT SOAP OVERVIEW CONTROLLER FOR THIS FIX
  Vitals.get($stateParams.vitalId, function(err, vitalDetail) {
    $scope.vitalDetail = vitalDetail;
    $state.reload();
  })
})
