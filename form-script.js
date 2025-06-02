

jQuery(document).ready(function($) {
    // تعريف أسعار التوصيل
   const deliveryPrices = {
  '01': {'للمكتب': 600, 'للمنزل': 1100},
  '02': {'للمكتب': 400, 'للمنزل': 700},
  '03': {'للمكتب': 500, 'للمنزل': 900},
  '04': {'للمكتب': 500, 'للمنزل': 700},
  '05': {'للمكتب': 400, 'للمنزل': 600},
  '06': {'للمكتب': 400, 'للمنزل': 600},
  '07': {'للمكتب': 500, 'للمنزل': 800},
  '08': {'للمكتب': 600, 'للمنزل': 1100},
  '09': {'للمكتب': 400, 'للمنزل': 500},
  '10': {'للمكتب': 400, 'للمنزل': 700},
  '11': {'للمكتب': 800, 'للمنزل': 1300},
  '12': {'للمكتب': 400, 'للمنزل': 800},
  '13': {'للمكتب': 400, 'للمنزل': 800},
  '14': {'للمكتب': 400, 'للمنزل': 800},
  '15': {'للمكتب': 400, 'للمنزل': 700},
  '16': {'للمكتب': 350, 'للمنزل': 500},
  '17': {'للمكتب': 500, 'للمنزل': 900},
  '18': {'للمكتب': 400, 'للمنزل': 600},
  '19': {'للمكتب': 250, 'للمنزل': 400},
  '20': {'للمكتب': 400, 'للمنزل': 800},
  '21': {'للمكتب': 400, 'للمنزل': 800},
  '22': {'للمكتب': 400, 'للمنزل': 800},
  '23': {'للمكتب': 400, 'للمنزل': 700},
  '24': {'للمكتب': 400, 'للمنزل': 700},
  '25': {'للمكتب': 400, 'للمنزل': 600},
  '26': {'للمكتب': 400, 'للمنزل': 700},
  '27': {'للمكتب': 400, 'للمنزل': 700},
  '28': {'للمكتب': 400, 'للمنزل': 700},
  '29': {'للمكتب': 400, 'للمنزل': 700},
  '30': {'للمكتب': 500, 'للمنزل': 1000},
  '31': {'للمكتب': 400, 'للمنزل': 700},
  '32': {'للمكتب': 500, 'للمنزل': 1000},
  '33': {'للمكتب': 600, 'للمنزل': 1300},
  '34': {'للمكتب': 400, 'للمنزل': 600},
  '35': {'للمكتب': 400, 'للمنزل': 700},
  '36': {'للمكتب': 400, 'للمنزل': 700},
  '37': {'للمكتب': 600, 'للمنزل': 1300},
  '38': {'للمكتب': 400, 'للمنزل': 800},
  '39': {'للمكتب': 500, 'للمنزل': 900},
  '40': {'للمكتب': 500, 'للمنزل': 700},
  '41': {'للمكتب': 500, 'للمنزل': 800},
  '42': {'للمكتب': 400, 'للمنزل': 700},
  '43': {'للمكتب': 400, 'للمنزل': 600},
  '44': {'للمكتب': 400, 'للمنزل': 700},
  '45': {'للمكتب': 500, 'للمنزل': 1000},
  '46': {'للمكتب': 400, 'للمنزل': 800},
  '47': {'للمكتب': 500, 'للمنزل': 900},
  '48': {'للمكتب': 400, 'للمنزل': 700},
  '49': {'للمكتب': 600, 'للمنزل': 1300},
  '50': {'للمكتب': 1200, 'للمنزل': 1400},
  '51': {'للمكتب': 500, 'للمنزل': 900},
  '52': {'للمكتب': 1300, 'للمنزل': 1300},
  '53': {'للمكتب': 600, 'للمنزل': 1300},
  '54': {'للمكتب': 1350, 'للمنزل': 1550},
  '55': {'للمكتب': 900, 'للمنزل': 900},
  '56': {'للمكتب': 900, 'للمنزل': 900},
  '57': {'للمكتب': 900, 'للمنزل': 900},
  '58': {'للمكتب': 500, 'للمنزل': 1000},
};
    // عناصر DOM
    const orderForm = $('#orderForm');
    const wilayaSelect = $('#wilaya');
    const communeSelect = $('#commune');
    const phoneInput = $('#phone');

    // تحميل البلديات
    $.getJSON(wc_custom_order.communes_url)
        .done(function(data) {
            // تعبئة الولايات
            const wilayas = [...new Set(data.map(item => item.wilaya_code))].sort();
            wilayas.forEach(code => {
                const wilaya = data.find(item => item.wilaya_code === code);
                wilayaSelect.append(`<option value="${code}">${code} - ${wilaya.wilaya_name}</option>`);
            });

            // حدث تغيير الولاية
            wilayaSelect.on('change', function() {
                communeSelect.empty().append('<option value="">اختر بلديتك</option>');
                communeSelect.prop('disabled', !this.value);

                if (this.value) {
                    const communes = data.filter(item => item.wilaya_code === this.value);
                    communes.forEach(commune => {
                        communeSelect.append(`<option value="${commune.commune_name}">${commune.commune_name}</option>`);
                    });
                }
                updatePrice();
            });
        })
        .fail(function() {
            console.error('خطأ في تحميل بيانات البلديات');
            wilayaSelect.append('<option value="">خطأ في تحميل البيانات</option>');
        });

    // تحديث السعر
    function updatePrice() {
        const wilaya = wilayaSelect.val();
        const deliveryType = $('input[name="delivery"]:checked').val();
        const quantity = parseInt($('#quantity').val()) || 1;
        const productPrice = parseFloat(wc_custom_order.price);

        if (wilaya && deliveryType && deliveryPrices[wilaya]) {
            const deliveryPrice = deliveryPrices[wilaya][deliveryType];
            const total = (productPrice * quantity) + deliveryPrice;
            
            $('#deliveryPrice').text(deliveryPrice + ' ' + wc_custom_order.currency);
            $('#totalPrice').text(total.toFixed(2) + ' ' + wc_custom_order.currency);
        } else {
            $('#deliveryPrice').text('اختر الولاية');
            $('#totalPrice').text('--');
        }
    }

    // تغيير الكمية
    window.changeQuantity = function(change) {
        const quantityInput = $('#quantity');
        let quantity = parseInt(quantityInput.val()) + change;
        quantity = Math.max(1, Math.min(10, quantity));
        quantityInput.val(quantity);
        updatePrice();
    };

    // أحداث التغيير
    $('input[name="delivery"]').on('change', updatePrice);
    $('#quantity').on('change', updatePrice);

    // إرسال النموذج
    orderForm.on('submit', function(e) {
        e.preventDefault();

        if (!phoneInput[0].checkValidity()) {
            phoneInput.addClass('highlight');
            setTimeout(() => phoneInput.removeClass('highlight'), 1000);
            return;
        }

        $.ajax({
            url: wc_custom_order.ajax_url,
            type: 'POST',
            data: {
                action: 'process_custom_order',
                security: wc_custom_order.nonce,
                product_id: wc_custom_order.product_id,
                quantity: $('#quantity').val(),
                phone: $('#phone').val(),
                wilaya: $('#wilaya').val(),
                commune: $('#commune').val(),
                address: $('#address').val(),
                delivery: $('input[name="delivery"]:checked').val()
            },
            success: function(response) {
                if (response.success && response.redirect) {
                    window.location.href = response.redirect;
                }
            },
            error: function() {
                alert('حدث خطأ أثناء معالجة الطلب');
            }
        });
    });

    // التهيئة الأولية
    updatePrice();
});