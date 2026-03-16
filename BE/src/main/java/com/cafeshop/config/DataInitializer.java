package com.cafeshop.config;

import com.cafeshop.model.*;
import com.cafeshop.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

        @Bean
        CommandLineRunner initData(
                        CategoryRepository categoryRepo,
                        ProductRepository productRepo,
                        BlogPostRepository blogRepo,
                        TestimonialRepository testimonialRepo) {
                return args -> {
                        log.info("🚀 Initializing Cafe Shop data...");

                        // Skip if data already exists (for PostgreSQL persistence)
                        if (categoryRepo.count() > 0) {
                                log.info("✅ Data already exists, skipping initialization.");
                                return;
                        }

                        Category catCafe = categoryRepo.save(Category.builder()
                                        .slug("cafe-rang-xay").name("Cà Phê Rang Xay").icon("☕").build());
                        Category catMut = categoryRepo.save(Category.builder()
                                        .slug("mut-gung").name("Mứt Gừng Phú Yên").icon("🫙").build());
                        Category catTieu = categoryRepo.save(Category.builder()
                                        .slug("ho-tieu").name("Hồ Tiêu").icon("🌶️").build());
                        Category catNhan = categoryRepo.save(Category.builder()
                                        .slug("ca-phe-nhan").name("Cà Phê Nhân Xanh").icon("🌱").build());

                        log.info("✅ Categories created: {}", categoryRepo.count());

                        // ============ PRODUCTS ============
                        // 1. Cà Phê Arabica Nguyên Chất
                        Product p1 = Product.builder()
                                        .name("Cà Phê Arabica Nguyên Chất")
                                        .slug("ca-phe-arabica-nguyen-chat")
                                        .category(catCafe)
                                        .image("https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop")
                                        .gallery(List.of(
                                                        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop",
                                                        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=600&fit=crop"))
                                        .price(new BigDecimal("185000"))
                                        .originalPrice(new BigDecimal("220000"))
                                        .unit("250g")
                                        .badge("Bán chạy").badgeType("hot")
                                        .description("Cà phê Arabica 100% từ vùng cao Cầu Đất - Đà Lạt, rang mộc nguyên chất không tẩm ướp. Hương thơm hoa quả tươi mát, vị chua nhẹ thanh dịu, hậu vị ngọt ngào khó quên.")
                                        .details(ProductDetails.builder()
                                                        .origin("Cầu Đất, Đà Lạt - Lâm Đồng")
                                                        .roastLevel("Rang vừa (Medium Roast)")
                                                        .process("Washed")
                                                        .altitude("1.500 - 1.700m")
                                                        .tasteNotes("Hoa nhài, cam quýt, đào, sô-cô-la trắng")
                                                        .brewMethods(List.of("Phin", "Pour Over", "Aeropress",
                                                                        "Cold Brew"))
                                                        .weight("250g / 500g / 1kg")
                                                        .shelf("6 tháng kể từ ngày rang")
                                                        .build())
                                        .stock(150).rating(4.8).reviews(127).featured(true).isNew(false)
                                        .build();
                        p1.addVariant(ProductVariant.builder().label("250g").price(new BigDecimal("185000")).build());
                        p1.addVariant(ProductVariant.builder().label("500g").price(new BigDecimal("345000")).build());
                        p1.addVariant(ProductVariant.builder().label("1kg").price(new BigDecimal("650000")).build());
                        productRepo.save(p1);

                        // 2. Cà Phê Robusta Premium
                        Product p2 = Product.builder()
                                        .name("Cà Phê Robusta Premium")
                                        .slug("ca-phe-robusta-premium")
                                        .category(catCafe)
                                        .image("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=600&fit=crop")
                                        .gallery(List.of(
                                                        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=600&fit=crop",
                                                        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=600&fit=crop"))
                                        .price(new BigDecimal("145000"))
                                        .originalPrice(null)
                                        .unit("250g")
                                        .badge("Mới").badgeType("new")
                                        .description("Robusta thuần chủng từ Đắk Nông, được tuyển chọn kỹ lưỡng và rang dark roast đặc trưng. Vị đắng mạnh, thể chất nặng, crema dày và đặc, hoàn hảo cho espresso và cà phê sữa.")
                                        .details(ProductDetails.builder()
                                                        .origin("Đắk Nông - Tây Nguyên")
                                                        .roastLevel("Rang đậm (Dark Roast)")
                                                        .process("Natural")
                                                        .altitude("600 - 900m")
                                                        .tasteNotes("Sô-cô-la đen, thuốc lào, gỗ tuyết tùng, caramel")
                                                        .brewMethods(List.of("Phin", "Espresso", "Moka Pot"))
                                                        .weight("250g / 500g / 1kg")
                                                        .shelf("6 tháng kể từ ngày rang")
                                                        .build())
                                        .stock(200).rating(4.7).reviews(89).featured(true).isNew(true)
                                        .build();
                        p2.addVariant(ProductVariant.builder().label("250g").price(new BigDecimal("145000")).build());
                        p2.addVariant(ProductVariant.builder().label("500g").price(new BigDecimal("275000")).build());
                        p2.addVariant(ProductVariant.builder().label("1kg").price(new BigDecimal("520000")).build());
                        productRepo.save(p2);

                        // 3. Cà Phê Phin Blend Đặc Biệt
                        Product p3 = Product.builder()
                                        .name("Cà Phê Phin Blend Đặc Biệt")
                                        .slug("ca-phe-phin-blend-dac-biet")
                                        .category(catCafe)
                                        .image("https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&h=600&fit=crop")
                                        .gallery(List.of(
                                                        "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&h=600&fit=crop"))
                                        .price(new BigDecimal("165000"))
                                        .originalPrice(new BigDecimal("195000"))
                                        .unit("250g")
                                        .badge("Giảm 15%").badgeType("sale")
                                        .description("Phối trộn hoàn hảo giữa Arabica 30% và Robusta 70%, được thiết kế riêng cho phin cà phê Việt Nam. Cho ly cà phê đậm đà, thơm ngon đúng vị, cân bằng giữa hương thơm và thể chất.")
                                        .details(ProductDetails.builder()
                                                        .origin("Phối trộn Lâm Đồng & Đắk Nông")
                                                        .roastLevel("Rang vừa đậm (Medium Dark)")
                                                        .process("Mixed")
                                                        .altitude("800 - 1.500m")
                                                        .tasteNotes("Caramel, dark chocolate, walnut, vị đắng dịu")
                                                        .brewMethods(List.of("Phin", "Espresso"))
                                                        .weight("250g / 500g / 1kg")
                                                        .shelf("6 tháng kể từ ngày rang")
                                                        .build())
                                        .stock(175).rating(4.9).reviews(203).featured(true).isNew(false)
                                        .build();
                        p3.addVariant(ProductVariant.builder().label("250g").price(new BigDecimal("165000")).build());
                        p3.addVariant(ProductVariant.builder().label("500g").price(new BigDecimal("310000")).build());
                        p3.addVariant(ProductVariant.builder().label("1kg").price(new BigDecimal("580000")).build());
                        productRepo.save(p3);

                        // 4. Cà Phê Espresso Blend
                        Product p4 = Product.builder()
                                        .name("Cà Phê Espresso Blend")
                                        .slug("ca-phe-espresso-blend")
                                        .category(catCafe)
                                        .image("https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=600&fit=crop")
                                        .gallery(List.of())
                                        .price(new BigDecimal("195000"))
                                        .originalPrice(null)
                                        .unit("250g")
                                        .badge(null).badgeType(null)
                                        .description("Blend espresso chuyên nghiệp, tỷ lệ Arabica 60% / Robusta 40%, rang ở nhiệt độ kiểm soát chính xác. Tạo crema đặc mịn, hương thơm phức tạp, vị đắng thanh và hậu vị kéo dài.")
                                        .details(ProductDetails.builder()
                                                        .origin("Ethiopia & Lâm Đồng")
                                                        .roastLevel("Rang vừa (Medium Roast)")
                                                        .process("Washed & Natural")
                                                        .altitude("1.200 - 2.000m")
                                                        .tasteNotes("Berries, milk chocolate, hazelnut, caramel")
                                                        .brewMethods(List.of("Espresso", "Cappuccino", "Latte"))
                                                        .weight("250g / 500g / 1kg")
                                                        .shelf("6 tháng kể từ ngày rang")
                                                        .build())
                                        .stock(100).rating(4.6).reviews(54).featured(false).isNew(false)
                                        .build();
                        p4.addVariant(ProductVariant.builder().label("250g").price(new BigDecimal("195000")).build());
                        p4.addVariant(ProductVariant.builder().label("500g").price(new BigDecimal("365000")).build());
                        p4.addVariant(ProductVariant.builder().label("1kg").price(new BigDecimal("700000")).build());
                        productRepo.save(p4);

                        // 5. Cà Phê Pha Phin 1kg (Kinh Doanh)
                        Product p5 = Product.builder()
                                        .name("Cà Phê Pha Phin 1kg (Kinh Doanh)")
                                        .slug("ca-phe-pha-phin-kinh-doanh")
                                        .category(catCafe)
                                        .image("https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=600&fit=crop")
                                        .gallery(List.of())
                                        .price(new BigDecimal("520000"))
                                        .originalPrice(new BigDecimal("600000"))
                                        .unit("1kg")
                                        .badge("Kinh doanh").badgeType("hot")
                                        .description("Gói 1kg dành cho quán cà phê, nhà hàng và kinh doanh. Cà phê rang xay phi 100% Robusta Đắk Lắk, rang đậm đặc trưng, phù hợp pha phin truyền thống. Đóng gói van xả khí chuyên nghiệp.")
                                        .details(ProductDetails.builder()
                                                        .origin("Đắk Lắk - Tây Nguyên")
                                                        .roastLevel("Rang đậm (Dark Roast)")
                                                        .process("Natural")
                                                        .altitude("500 - 800m")
                                                        .tasteNotes("Đắng đậm, bơ, caramel đen")
                                                        .brewMethods(List.of("Phin", "Moka Pot"))
                                                        .weight("1kg / 5kg")
                                                        .shelf("6 tháng kể từ ngày rang")
                                                        .build())
                                        .stock(80).rating(4.7).reviews(167).featured(false).isNew(false)
                                        .build();
                        p5.addVariant(ProductVariant.builder().label("1kg").price(new BigDecimal("520000")).build());
                        p5.addVariant(ProductVariant.builder().label("5kg").price(new BigDecimal("2400000")).build());
                        productRepo.save(p5);

                        // 6. Mứt Gừng Phú Yên Truyền Thống
                        Product p6 = Product.builder()
                                        .name("Mứt Gừng Phú Yên Truyền Thống")
                                        .slug("mut-gung-phu-yen-truyen-thong")
                                        .category(catMut)
                                        .image("https://images.unsplash.com/photo-1573821663912-569905455b1c?w=600&h=600&fit=crop")
                                        .gallery(List.of(
                                                        "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=600&h=600&fit=crop"))
                                        .price(new BigDecimal("95000"))
                                        .originalPrice(new BigDecimal("120000"))
                                        .unit("300g")
                                        .badge("Đặc sản").badgeType("organic")
                                        .description("Mứt gừng Phú Yên làm thủ công từ gừng tươi Sơn Hòa - Phú Yên nổi tiếng cay nồng. Chế biến theo công thức truyền thống, không phẩm màu, không chất bảo quản, đóng gói hũ thủy tinh sạch sẽ.")
                                        .details(ProductDetails.builder()
                                                        .origin("Sơn Hòa, Phú Yên")
                                                        .ingredients("Gừng tươi, đường mía, nước")
                                                        .noPreservatives(true)
                                                        .shelf("6 tháng (bảo quản khô mát)")
                                                        .packaging("Hũ thủy tinh có nắp kín")
                                                        .build())
                                        .stock(120).rating(4.9).reviews(245).featured(true).isNew(false)
                                        .build();
                        p6.addVariant(ProductVariant.builder().label("150g").price(new BigDecimal("55000")).build());
                        p6.addVariant(ProductVariant.builder().label("300g").price(new BigDecimal("95000")).build());
                        p6.addVariant(ProductVariant.builder().label("500g").price(new BigDecimal("150000")).build());
                        productRepo.save(p6);

                        // 7. Mứt Gừng Dẻo Phú Yên
                        Product p7 = Product.builder()
                                        .name("Mứt Gừng Dẻo Phú Yên")
                                        .slug("mut-gung-deo-phu-yen")
                                        .category(catMut)
                                        .image("https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&h=600&fit=crop")
                                        .gallery(List.of())
                                        .price(new BigDecimal("85000"))
                                        .originalPrice(null)
                                        .unit("200g")
                                        .badge("Mới").badgeType("new")
                                        .description("Mứt gừng dẻo nhuyễn, thái lát mỏng, vị cay vừa phải, ngọt thanh. Thích hợp dùng kèm trà gừng, nước chanh, hoặc ăn trực tiếp. Sản phẩm thuần tự nhiên từ gừng sạch Phú Yên.")
                                        .details(ProductDetails.builder()
                                                        .origin("Tuy An, Phú Yên")
                                                        .ingredients("Gừng tươi, đường mía")
                                                        .noPreservatives(true)
                                                        .shelf("3 tháng (bảo quản tủ lạnh sau khi mở)")
                                                        .packaging("Túi zip cao cấp")
                                                        .build())
                                        .stock(90).rating(4.7).reviews(78).featured(true).isNew(true)
                                        .build();
                        p7.addVariant(ProductVariant.builder().label("200g").price(new BigDecimal("85000")).build());
                        p7.addVariant(ProductVariant.builder().label("400g").price(new BigDecimal("155000")).build());
                        productRepo.save(p7);

                        // 8. Trà Gừng Phú Yên Hòa Tan
                        Product p8 = Product.builder()
                                        .name("Trà Gừng Phú Yên Hòa Tan")
                                        .slug("tra-gung-hoa-tan-phu-yen")
                                        .category(catMut)
                                        .image("https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop")
                                        .gallery(List.of())
                                        .price(new BigDecimal("75000"))
                                        .originalPrice(new BigDecimal("90000"))
                                        .unit("200g")
                                        .badge("Giảm 17%").badgeType("sale")
                                        .description("Trà gừng hòa tan từ gừng Phú Yên xay mịn, kết hợp mật ong hoa cà phê. Tiện lợi pha nhanh, giữ ấm cơ thể, tốt cho tiêu hóa. Không chứa đường nhân tạo và phẩm màu.")
                                        .details(ProductDetails.builder()
                                                        .origin("Phú Yên")
                                                        .ingredients("Gừng sấy, mật ong, quế, lá stevia")
                                                        .noPreservatives(true)
                                                        .shelf("12 tháng (bảo quản khô, thoáng)")
                                                        .packaging("20 gói / hộp")
                                                        .build())
                                        .stock(150).rating(4.8).reviews(112).featured(false).isNew(false)
                                        .build();
                        p8.addVariant(ProductVariant.builder().label("200g (20 gói)").price(new BigDecimal("75000"))
                                        .build());
                        p8.addVariant(ProductVariant.builder().label("400g (40 gói)").price(new BigDecimal("140000"))
                                        .build());
                        productRepo.save(p8);

                        // 9. Hồ Tiêu Đen Phú Quốc Nguyên Hạt
                        Product p9 = Product.builder()
                                        .name("Hồ Tiêu Đen Phú Quốc Nguyên Hạt")
                                        .slug("ho-tieu-den-phu-quoc-nguyen-hat")
                                        .category(catTieu)
                                        .image("https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop")
                                        .gallery(List.of(
                                                        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop"))
                                        .price(new BigDecimal("125000"))
                                        .originalPrice(new BigDecimal("150000"))
                                        .unit("500g")
                                        .badge("Hữu cơ").badgeType("organic")
                                        .description("Hồ tiêu đen Phú Quốc nguyên hạt, thu hoạch thủ công khi chín hoàn toàn. Cay nồng tự nhiên, mùi thơm đặc trưng vùng đất Phú Quốc. Không tẩy trắng, không phụ gia.")
                                        .details(ProductDetails.builder()
                                                        .origin("Phú Quốc, Kiên Giang")
                                                        .type("Hồ tiêu đen nguyên hạt")
                                                        .doiGCI("GCI Chứng nhận")
                                                        .noAdditives(true)
                                                        .shelf("24 tháng (bảo quản khô, tránh ánh sáng)")
                                                        .packaging("Túi kraft có van thoát khí")
                                                        .build())
                                        .stock(200).rating(4.9).reviews(189).featured(true).isNew(false)
                                        .build();
                        p9.addVariant(ProductVariant.builder().label("200g").price(new BigDecimal("55000")).build());
                        p9.addVariant(ProductVariant.builder().label("500g").price(new BigDecimal("125000")).build());
                        p9.addVariant(ProductVariant.builder().label("1kg").price(new BigDecimal("230000")).build());
                        productRepo.save(p9);

                        // 10. Hồ Tiêu Xanh Tươi Phú Quốc
                        Product p10 = Product.builder()
                                        .name("Hồ Tiêu Xanh Tươi Phú Quốc")
                                        .slug("ho-tieu-xanh-tuoi-phu-quoc")
                                        .category(catTieu)
                                        .image("https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&h=600&fit=crop")
                                        .gallery(List.of())
                                        .price(new BigDecimal("98000"))
                                        .originalPrice(null)
                                        .unit("200g")
                                        .badge("Mới").badgeType("new")
                                        .description("Hồ tiêu xanh tươi ngâm nước muối, thu hoạch khi còn xanh, hương thơm nhẹ nhàng và cay vừa phải. Dùng trong nấu ăn, làm tăng hương vị tự nhiên cho các món salad, hải sản và thịt nướng.")
                                        .details(ProductDetails.builder()
                                                        .origin("Phú Quốc, Kiên Giang")
                                                        .type("Hồ tiêu xanh ngâm nước muối")
                                                        .noAdditives(true)
                                                        .shelf("12 tháng (bảo quản lạnh sau khi mở)")
                                                        .packaging("Lọ thủy tinh")
                                                        .build())
                                        .stock(75).rating(4.6).reviews(43).featured(false).isNew(true)
                                        .build();
                        p10.addVariant(ProductVariant.builder().label("200g").price(new BigDecimal("98000")).build());
                        p10.addVariant(ProductVariant.builder().label("400g").price(new BigDecimal("185000")).build());
                        productRepo.save(p10);

                        // 11. Hồ Tiêu Trắng Phú Quốc Xay Mịn
                        Product p11 = Product.builder()
                                        .name("Hồ Tiêu Trắng Phú Quốc Xay Mịn")
                                        .slug("ho-tieu-trang-phu-quoc-xay-min")
                                        .category(catTieu)
                                        .image("https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop")
                                        .gallery(List.of())
                                        .price(new BigDecimal("155000"))
                                        .originalPrice(new BigDecimal("180000"))
                                        .unit("200g")
                                        .badge("Cao cấp").badgeType("hot")
                                        .description("Hồ tiêu trắng Phú Quốc xay mịn, được ngâm tách vỏ tự nhiên, phơi nắng sạch. Cay nhẹ hơn tiêu đen, mùi thơm thanh tao, phù hợp các món súp, sốt kem và hải sản.")
                                        .details(ProductDetails.builder()
                                                        .origin("Phú Quốc, Kiên Giang")
                                                        .type("Hồ tiêu trắng xay mịn")
                                                        .noAdditives(true)
                                                        .shelf("18 tháng (bảo quản khô)")
                                                        .packaging("Lọ thủy tinh có nắp kín")
                                                        .build())
                                        .stock(110).rating(4.8).reviews(67).featured(false).isNew(false)
                                        .build();
                        p11.addVariant(ProductVariant.builder().label("100g").price(new BigDecimal("85000")).build());
                        p11.addVariant(ProductVariant.builder().label("200g").price(new BigDecimal("155000")).build());
                        p11.addVariant(ProductVariant.builder().label("500g").price(new BigDecimal("360000")).build());
                        productRepo.save(p11);

                        // 12. Cà Phê Nhân Xanh Arabica Cầu Đất
                        Product p12 = Product.builder()
                                        .name("Cà Phê Nhân Xanh Arabica Cầu Đất")
                                        .slug("ca-phe-nhan-xanh-arabica-cau-dat")
                                        .category(catNhan)
                                        .image("https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=600&fit=crop")
                                        .gallery(List.of())
                                        .price(new BigDecimal("320000"))
                                        .originalPrice(new BigDecimal("380000"))
                                        .unit("1kg")
                                        .badge("Wholesale").badgeType("hot")
                                        .description("Cà phê nhân xanh Arabica Cầu Đất thu hoạch theo mùa, tuyển chọn hạt đều và đẹp. Dành cho các roaster chuyên nghiệp muốn tự rang cà phê theo công thức riêng. Chứng nhận 4C.")
                                        .details(ProductDetails.builder()
                                                        .origin("Cầu Đất, Đà Lạt - Lâm Đồng")
                                                        .process("Washed")
                                                        .altitude("1.500 - 1.700m")
                                                        .certification("4C, Rainforest Alliance")
                                                        .moisture("11-12%")
                                                        .screen("Screen 16+")
                                                        .shelf("12 tháng (bảo quản khô, thoáng)")
                                                        .build())
                                        .stock(500).rating(4.8).reviews(34).featured(false).isNew(false)
                                        .build();
                        p12.addVariant(ProductVariant.builder().label("1kg").price(new BigDecimal("320000")).build());
                        p12.addVariant(ProductVariant.builder().label("5kg").price(new BigDecimal("1500000")).build());
                        p12.addVariant(ProductVariant.builder().label("10kg").price(new BigDecimal("2800000")).build());
                        productRepo.save(p12);

                        log.info("✅ Products created: {}", productRepo.count());

                        // ============ BLOG POSTS ============
                        blogRepo.save(BlogPost.builder()
                                        .title("Arabica vs Robusta: Sự khác biệt mà bạn cần biết")
                                        .slug("arabica-vs-robusta")
                                        .excerpt("Hai loại cà phê phổ biến nhất thế giới có gì khác nhau? Hương vị, caffeine, cách pha – tất cả đều có sự khác biệt thú vị mà bạn nên khám phá.")
                                        .content("<p>Arabica và Robusta là hai giống cà phê phổ biến nhất thế giới, chiếm hơn 98% sản lượng cà phê toàn cầu...</p>")
                                        .image("https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&h=400&fit=crop")
                                        .category("Kiến thức cà phê")
                                        .date(LocalDate.of(2026, 1, 15))
                                        .readTime("5 phút đọc")
                                        .build());

                        blogRepo.save(BlogPost.builder()
                                        .title("Mứt gừng Phú Yên – Đặc sản xứ Nẫu trăm năm")
                                        .slug("mut-gung-phu-yen-dac-san")
                                        .excerpt("Gừng Sơn Hòa Phú Yên nổi tiếng cay nồng nhất Việt Nam. Cùng khám phá hành trình từ củ gừng tươi đến mứt gừng thơm ngon đặc sản vùng đất này.")
                                        .content("<p>Phú Yên – vùng đất nẫu ven biển miền Trung, nổi tiếng với gừng Sơn Hòa có độ cay nồng vượt trội...</p>")
                                        .image("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop")
                                        .category("Sản phẩm")
                                        .date(LocalDate.of(2026, 1, 22))
                                        .readTime("4 phút đọc")
                                        .build());

                        blogRepo.save(BlogPost.builder()
                                        .title("Hướng dẫn pha cà phê Phin chuẩn vị Việt Nam")
                                        .slug("huong-dan-pha-ca-phe-phin")
                                        .excerpt("Pha cà phê phin tưởng đơn giản nhưng có nhiều bí quyết để có ly cà phê hoàn hảo. Nước nóng bao nhiêu độ? Bao nhiêu gram cà phê? Tất cả trong bài viết này.")
                                        .content("<p>Cà phê phin là phương pháp pha chế đặc trưng của Việt Nam, đơn giản nhưng cho ra ly cà phê đậm đà khó quên...</p>")
                                        .image("https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop")
                                        .category("Hướng dẫn")
                                        .date(LocalDate.of(2026, 2, 1))
                                        .readTime("6 phút đọc")
                                        .build());

                        log.info("✅ Blog posts created: {}", blogRepo.count());

                        // ============ TESTIMONIALS ============
                        testimonialRepo.save(Testimonial.builder()
                                        .name("Nguyễn Văn Minh").role("Chủ quán cà phê").city("TP. Hồ Chí Minh")
                                        .avatar("https://i.pravatar.cc/100?img=11").rating(5)
                                        .text("Cà phê Arabica chất lượng xuất sắc! Mình đã nhập cho quán được 3 tháng và khách hàng phản hồi rất tích cực. Hương thơm đặc biệt, vị thanh nhẹ không bị đắng gắt. Sẽ tiếp tục đặt hàng dài lâu.")
                                        .build());

                        testimonialRepo.save(Testimonial.builder()
                                        .name("Trần Thị Hoa").role("Nhân viên văn phòng").city("Hà Nội")
                                        .avatar("https://i.pravatar.cc/100?img=47").rating(5)
                                        .text("Mứt gừng Phú Yên ngon tuyệt! Mua về làm quà Tết cho gia đình ai cũng khen. Vị cay vừa phải, thơm mùi gừng tự nhiên, không quá ngọt. Đóng gói đẹp, giao hàng nhanh.")
                                        .build());

                        testimonialRepo.save(Testimonial.builder()
                                        .name("Lê Quang Hùng").role("Đầu bếp chuyên nghiệp").city("Đà Nẵng")
                                        .avatar("https://i.pravatar.cc/100?img=68").rating(5)
                                        .text("Hồ tiêu đen Phú Quốc chất lượng đỉnh! Cay nồng tự nhiên, mùi thơm đặc trưng. Mình dùng cho nhà hàng, khách hàng rất thích. Không có vị gắt hay hóa chất như hàng không rõ nguồn gốc.")
                                        .build());

                        testimonialRepo.save(Testimonial.builder()
                                        .name("Phạm Thị Thu").role("Blogger ẩm thực").city("Hội An")
                                        .avatar("https://i.pravatar.cc/100?img=32").rating(5)
                                        .text("Tìm được shop này thật may mắn! Cà phê rang xay Phin Blend đúng chuẩn vị cà phê Việt Nam truyền thống. Mỗi sáng pha một ly thấy tinh thần phấn khởi hẳn. Chắc chắn sẽ giới thiệu cho bạn bè.")
                                        .build());

                        log.info("✅ Testimonials created: {}", testimonialRepo.count());
                        log.info("🎉 Cafe Shop data initialization complete!");
                };
        }

        /**
         * Create default admin user if not exists.
         * Default credentials: admin / admin123
         */
        @Bean
        CommandLineRunner initAdminUser(AdminUserRepository adminUserRepo) {
                return args -> {
                        if (!adminUserRepo.existsByUsername("admin")) {
                                String hashedPassword = com.cafeshop.controller.AdminAuthController
                                                .hashPassword("admin123");
                                adminUserRepo.save(AdminUser.builder()
                                                .username("admin")
                                                .password(hashedPassword)
                                                .fullName("Quản Trị Viên")
                                                .role("ADMIN")
                                                .active(true)
                                                .build());
                                log.info("✅ Default admin user created (admin / admin123)");
                        } else {
                                log.info("✅ Admin user already exists.");
                        }
                };
        }
}
