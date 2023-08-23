console.log("Ticket Page Loaded!")
document.addEventListener('alpine:init', () => {
    Alpine.data('tickets', () => ({
        date: null,
        ticketTypes: [
            {
                name: 'Sri Lankan Adult',
                peak: 6,
                offPeak: 4,
                count: 0,
                total: 0
            },
            {
                name: 'Sri Lankan Child',
                peak: 3,
                offPeak: 2,
                count: 0,
                total: 0
            },
            {
                name: 'Foreign Adult',
                peak: 13,
                offPeak: 10,
                count: 0,
                total: 0
            },
            {
                name: 'Foreign Child',
                peak: 8,
                offPeak: 5,
                count: 0,
                total: 0
            },
            {
                name: 'Infant',
                peak: 0,
                offPeak: 0,
                count: 0,
                total: 0
            },
        ],



        //total with all ticktes
        selectedTimeSlots: [],

                calculateSubtotal() {
                    //subtotal by summing up the total values of all selected tickets
                    return this.ticketTypes.reduce((acc, ticket) => acc + ticket.total, 0);
                },

        openTimes: [
            {
                title: '7AM to 8AM',
                isPeak: false
            },
            {
                title: '8AM to 9AM',
                isPeak: false
            },
            {
                title: '9AM to 10AM',
                isPeak: false
            },
            {
                title: '10AM to 11AM (PEAK)',
                isPeak: true
            },
            {
                title: '11AM to 12PM (PEAK)',
                isPeak: true
            },
            {
                title: '12PM to 1PM(PEAK)',
                isPeak: true
            },
            {
                title: '1PM to 2PM',
                isPeak: false
            },
            {
                title: '2PM to 3PM',
                isPeak: false
            },
            {
                title: '3PM to 4PM(PEAK)',
                isPeak: true
            },
            {
                title: '4PM to 5PM(PEAK)',
                isPeak: true
            },
            {
                title: '5PM to 6PM(PEAK)',
                isPeak: true
            },
        ],

        selectedTimeSlots: [],

        showTimes: false,
        //------- Functions -------

        selectTimeSlot(index) {

            // this will check if the index is already in the array
            if (this.selectedTimeSlots.includes(index)) {

                // remove the index from the array
                this.selectedTimeSlots = this.selectedTimeSlots.filter(item => item !== index);

            } 
            else {
                // this gets the last element of the array
                let lastElement = this.selectedTimeSlots[this.selectedTimeSlots.length - 1];

                // this adds 1 to the last element and checks if the value of it equals to the index
                if (!this.selectedTimeSlots.length || index - 1 == lastElement) {

                    // add the index to the array
                    this.selectedTimeSlots.push(index);

                } 
             }

            // this sorts the array
            this.selectedTimeSlots = this.selectedTimeSlots.sort();
            console.log(this.selectedTimeSlots);
        },
        getCurrentDate(){
            const today=new Date();
            return today.toLocalDateString('en-US');
        },

        calculate(ticketType) {
            let total = 0;
            this.selectedTimeSlots.forEach((timeSlotIndex) => {

                // calculate the total
                total += parseInt(ticketType.count * (this.openTimes[timeSlotIndex].isPeak ? ticketType.peak : ticketType.offPeak));
            });

            ticketType.total = total;
        
        },
        totalCalc(ticketType){
            this.totalPayable=0;
        },
        calculateGrandTotal(ticketTypes){
            let grandTotal=0;
            for (const ticketType of ticketTypes){
                grandTotal+=ticketType.total;
            }
            this.totalPayable =grandTotal;
            return grandTotal;
        },
       //checkout---STORE IN LOCAl STORAGE
        gotoCheckout(){
                
           //store the data in the local storage         
            localStorage.setItem('SavedDate',JSON.stringify(this.date)); 
            localStorage.setItem('SavedTimeslot',JSON.stringify(this.selectedTimeSlots));
            localStorage.setItem('SavedPrice',JSON.stringify(this.ticketTypes)); 
            localStorage.setItem('TotalPayable',this.totalPayable);       
            


            window.location.href = 'details.html';
            
        }
    
    }));
});
/////////////////////Summary in another page////////////////////////////////

/////////////////////////DETAILS//////////////////////////////////

 document.addEventListener('alpine:init', () => {
     Alpine.data('checkout', () => ({
  
        SavedDate: null,
        SavedTimeslot:[],
        SavedPrice:'',
        TotalPayable:'',
        openTimes: [
            {
                title: '7AM to 8AM',
                isPeak: false
            },
            {
                title: '8AM to 9AM',
                isPeak: false
            },
            {
                title: '9AM to 10AM',
                isPeak: false
            },
            {
                title: '10AM to 11AM',
                isPeak: true
            },
            {
                title: '11AM to 12PM',
                isPeak: true
            },
            {
                title: '12PM to 1PM',
                isPeak: true
            },
            {
                title: '1PM to 2PM',
                isPeak: false
            },
            {
                title: '2PM to 3PM',
                isPeak: false
            },
            {
                title: '3PM to 4PM',
                isPeak: true
            },
            {
                title: '4PM to 5PM',
                isPeak: true
            },
            {
                title: '5PM to 6PM',
                isPeak: true
            },
        ],
        guest: JSON.parse(localStorage.getItem('guest')) || {
             fullName: '',
             mobile: '',
             email: '',
             gender: ''
         },

         confirmEmail: '',
         emailMismatch: false,


         init() {
          //checks email validity

            this.$watch('guest.email', (value) => {
                this.emailMismatch = this.confirmEmail !== value;
            });

            this.$watch('confirmEmail', (value) => {
                this.emailMismatch = this.guest.email !== value;
            });
        

            this.SavedDate = JSON.parse(localStorage.getItem('SavedDate'));
            this.SavedTimeslot = JSON.parse(localStorage.getItem('SavedTimeslot'));
            this.SavedPrice = JSON.parse(localStorage.getItem('SavedPrice'));
            this.TotalPayable = JSON.parse(localStorage.getItem('TotalPayable'));


             const input = document.querySelector("#mobile");
             window.intlTelInput(input, {
                 utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
             });
         },



        gotoPayment() {

  // Check if email confirmation matches
  if (this.emailMismatch) {
    alert('Email confirmation does not match.');
    return;
}

           // sets the guest data to local storage
         localStorage.setItem('guest', JSON.stringify(this.guest));

             window.location.href = 'payment.html'

        },
        // filters tickets in summary table
        get filteredTickets() {
            return this.SavedPrice.filter(ticketType => ticketType.count > 0);
        }
  
     }));
    });