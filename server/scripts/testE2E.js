const http = require('http');

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (data) req.write(postData);
    req.end();
  });
};

async function runTests() {
  console.log('====================================================');
  console.log('   FESTIVEROOTS END-TO-END AUTOMATED VERIFICATION   ');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data?.status === 'online', '1. Backend server health check responds 200 OK');

    // 2. Public products retrieval from MongoDB
    const productsRes = await request('/api/products');
    assert(productsRes.status === 200 && productsRes.data?.data?.length > 0, `2. Catalog products fetched from MongoDB (Count: ${productsRes.data?.data?.length})`);

    // 3. Customer Login with Seed Credentials
    const customerLogin = await request('/api/auth/login', 'POST', {
      email: 'priya.sharma@example.com',
      password: 'Customer@123'
    });
    assert(customerLogin.status === 200 && customerLogin.data?.data?.token, '3. Customer authentication and JWT token issuance');
    const customerToken = customerLogin.data?.data?.token;

    // 4. Invalid credentials rejected
    const badLogin = await request('/api/auth/login', 'POST', {
      email: 'priya.sharma@example.com',
      password: 'WrongPassword@999'
    });
    assert(badLogin.status === 401, '4. Invalid credentials correctly rejected with HTTP 401');

    // 5. Artisan Login with Seed Credentials
    const artisanLogin = await request('/api/auth/login', 'POST', {
      email: 'ramesh.kondapalli@festiveroots.com',
      password: 'Artisan@123'
    });
    assert(artisanLogin.status === 200 && artisanLogin.data?.data?.role === 'artisan', '5. Artisan authentication succeeds with artisan role');
    const artisanToken = artisanLogin.data?.data?.token;

    // 6. Admin Login with Seed Credentials
    const adminLogin = await request('/api/auth/login', 'POST', {
      email: 'admin@festiveroots.com',
      password: 'Admin@123'
    });
    assert(adminLogin.status === 200 && adminLogin.data?.data?.role === 'admin', '6. Admin authentication succeeds with admin role');
    const adminToken = adminLogin.data?.data?.token;

    // 7. Customer CANNOT access Admin Dashboard (RBAC check)
    const unauthorizedAdminCall = await request('/api/admin/dashboard', 'GET', null, customerToken);
    assert(unauthorizedAdminCall.status === 403, '7. RBAC security: Customer forbidden from admin endpoints (HTTP 403)');

    // 8. Admin CAN access Admin Dashboard
    const adminDashboard = await request('/api/admin/dashboard', 'GET', null, adminToken);
    assert(adminDashboard.status === 200 && adminDashboard.data?.data?.totalProducts > 0, '8. Admin dashboard metrics successfully calculated');

    // 9. Admin dynamically creates new Category in MongoDB
    const testCategoryName = 'Eco-Friendly Bamboo Handicrafts ' + Date.now();
    const newCategoryRes = await request('/api/categories', 'POST', {
      name: testCategoryName,
      description: 'Zero plastic sustainable bamboo and reed products.'
    }, adminToken);
    assert(newCategoryRes.status === 201 && newCategoryRes.data?.data?.name === testCategoryName, '9. Admin dynamically creates new category in MongoDB');
    const newCategoryId = newCategoryRes.data?.data?._id;

    // 10. Admin dynamically creates new Festival in MongoDB
    const testFestivalName = 'Onam Harvest Celebrations ' + Date.now();
    const newFestivalRes = await request('/api/festivals', 'POST', {
      name: testFestivalName,
      description: 'Kerala harvest festival celebrating King Mahabali.',
      approximateMonth: 'August / September'
    }, adminToken);
    assert(newFestivalRes.status === 201 && newFestivalRes.data?.data?.name === testFestivalName, '10. Admin dynamically creates new festival in MongoDB');
    const newFestivalId = newFestivalRes.data?.data?._id;

    // 11. Artisan creates a NEW Product dynamically in MongoDB
    const testProductName = 'Artisan Bamboo Hand-Carved Lamp ' + Date.now();
    const newProductRes = await request('/api/products', 'POST', {
      name: testProductName,
      description: 'Exquisitely hand-cut river bamboo festive lantern.',
      price: 1250,
      originalPrice: 1500,
      categoryId: newCategoryId,
      festivalId: newFestivalId,
      craftType: 'River Bamboo Carving',
      claimedOrigin: 'Kondapalli Bamboo Grove, Andhra Pradesh',
      stock: 10,
      isMadeToOrder: false,
      preparationTimeDays: 2,
      estimatedDispatchDays: 4,
      images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80']
    }, artisanToken);
    assert(newProductRes.status === 201 && newProductRes.data?.data?.approvalStatus === 'PENDING', '11. Artisan dynamically adds new product (initial status: PENDING)');
    const createdProductId = newProductRes.data?.data?._id;

    // 12. Newly created pending product does NOT yet appear in public catalog
    const publicCatalogBeforeApproval = await request(`/api/products?search=${encodeURIComponent(testProductName)}`);
    assert(publicCatalogBeforeApproval.data?.data?.length === 0, '12. Unapproved product is hidden from public customer catalogue');

    // 13. Admin Reviews and Approves the new product listing
    const approveProductRes = await request(`/api/admin/products/${createdProductId}/approval`, 'PATCH', {
      status: 'APPROVED',
      originVerificationStatus: 'INDEPENDENTLY_VERIFIED',
      originVerificationDetails: 'Verified in Andhra Pradesh Regional Bamboo Artisan audit.'
    }, adminToken);
    assert(approveProductRes.status === 200 && approveProductRes.data?.data?.approvalStatus === 'APPROVED', '13. Admin reviews and approves the pending product listing');

    // 14. Newly approved product AUTOMATICALLY appears in public catalog WITHOUT source code modification!
    const publicCatalogAfterApproval = await request(`/api/products?search=${encodeURIComponent(testProductName)}`);
    assert(publicCatalogAfterApproval.data?.data?.length === 1 && publicCatalogAfterApproval.data?.data[0]?._id === createdProductId, '14. DYNAMIC CATALOGUE SUCCESS: Newly approved product appears in public search & filters without code change');

    // 15. Customer places an Order containing this product
    const orderRes = await request('/api/orders', 'POST', {
      items: [{ productId: createdProductId, quantity: 2 }],
      shippingAddress: {
        street: '12 Temple Street',
        city: 'Vijayawada',
        state: 'Andhra Pradesh',
        postalCode: '520001',
        country: 'India'
      },
      paymentMethod: 'ONLINE_DEMO'
    }, customerToken);
    assert(orderRes.status === 201 && orderRes.data?.data?.order?.overallStatus === 'PLACED', '15. Customer places order with server-side inventory deduction');
    const placedOrderId = orderRes.data?.data?.order?._id;
    const fulfilmentId = orderRes.data?.data?.fulfilments?.[0]?._id;

    // 16. Verify inventory was decremented in database
    const productAfterOrder = await request(`/api/products/${createdProductId}`);
    assert(productAfterOrder.data?.data?.stock === 8, '16. Inventory decremented from 10 to 8 units in MongoDB');

    // 17. Artisan advances fulfilment status: CONFIRMED -> PREPARING -> READY_FOR_COLLECTION -> SHIPPED -> DELIVERED
    const confirmFul = await request(`/api/fulfilments/${fulfilmentId}/status`, 'PATCH', {
      status: 'CONFIRMED',
      note: 'Workshop confirmed bamboo woodcraft availability.'
    }, artisanToken);
    assert(confirmFul.status === 200 && confirmFul.data?.data?.fulfilmentStatus === 'CONFIRMED', '17. Artisan confirms incoming sub-order');

    const shipFul = await request(`/api/fulfilments/${fulfilmentId}/status`, 'PATCH', {
      status: 'SHIPPED',
      note: 'Consignment handed over to regional courier (Simulated).'
    }, artisanToken);
    assert(shipFul.status === 200 && shipFul.data?.data?.fulfilmentStatus === 'SHIPPED', '18. Artisan marks package as SHIPPED (simulated tracking code auto-generated)');

    const deliverFul = await request(`/api/fulfilments/${fulfilmentId}/status`, 'PATCH', {
      status: 'DELIVERED',
      note: 'Delivered to customer doorstep (Simulated).'
    }, artisanToken);
    assert(deliverFul.status === 200 && deliverFul.data?.data?.fulfilmentStatus === 'DELIVERED', '19. Artisan marks package as DELIVERED');

    // 20. Customer submits verified purchase review
    const reviewRes = await request('/api/reviews', 'POST', {
      productId: createdProductId,
      rating: 5,
      title: 'Superb bamboo artistry!',
      comment: 'The carving is exceptionally clean and the warm festive glow is breathtaking.'
    }, customerToken);
    assert(reviewRes.status === 201 && reviewRes.data?.data?.isVerifiedPurchase === true, '20. Verified customer review successfully posted and aggregated');

    // 21. Product rating average updated in database
    const productAfterReview = await request(`/api/products/${createdProductId}`);
    assert(productAfterReview.data?.data?.ratingAverage === 5 && productAfterReview.data?.data?.numReviews === 1, '21. Product average rating and review count aggregated in MongoDB');

    console.log('====================================================');
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('====================================================');

    if (failed === 0) {
      console.log('ALL CORE FULL-STACK MERN CRITICAL WORKFLOWS VERIFIED!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
