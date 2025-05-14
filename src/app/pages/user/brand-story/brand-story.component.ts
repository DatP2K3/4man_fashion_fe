import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-story',
  standalone: false,
  templateUrl: './brand-story.component.html',
  styleUrls: ['./brand-story.component.scss'],
})
export class BrandStoryComponent implements OnInit {
  milestones: any[] = [
    {
      year: '2019',
      title: 'Khởi đầu hành trình',
      description:
        'Từ một ý tưởng đơn giản về việc tạo ra những sản phẩm thời trang nam chất lượng cao với giá cả hợp lý, 4ManFashion đã chính thức được thành lập.',
    },
    {
      year: '2020',
      title: 'Vượt qua thách thức',
      description:
        'Trong bối cảnh đầy thử thách của đại dịch, chúng tôi đã nhanh chóng chuyển đổi mô hình kinh doanh, tập trung vào kênh online và đạt được những thành công bước đầu.',
    },
    {
      year: '2022',
      title: 'Mở rộng sản phẩm',
      description:
        'Chúng tôi đã mở rộng danh mục sản phẩm, ra mắt nhiều dòng sản phẩm mới đáp ứng nhu cầu đa dạng của khách hàng. Cửa hàng đầu tiên được khai trương tại Hà Nội.',
    },
    {
      year: '2025',
      title: 'Phát triển bền vững',
      description:
        'Với cam kết về chất lượng và trách nhiệm xã hội, chúng tôi đã triển khai nhiều sáng kiến bền vững và mở rộng mạng lưới cửa hàng trên toàn quốc.',
    },
  ];

  team = [
    {
      name: 'Phan Đình Đạt',
      position: 'Nhà sáng lập & CEO',
      bio: 'Với hơn 10 năm kinh nghiệm trong ngành thời trang, anh Đạt đã dẫn dắt 4ManFashion từ những ngày đầu với tầm nhìn tạo ra những sản phẩm thời trang nam chất lượng cao, giá hợp lý.',
      image: 'assets/images/brand-story/founder-1.jpg',
    },
    {
      name: 'Nguyễn Văn Bảo',
      position: 'Giám đốc thiết kế',
      bio: 'Chị B mang đến những thiết kế hiện đại, tinh tế và phù hợp với người Việt Nam. Với hơn 8 năm kinh nghiệm, chị đã góp phần định hình phong cách đặc trưng của 4ManFashion.',
      image: 'assets/images/brand-story/founder-2.jpg',
    },
    {
      name: 'Lê Văn C',
      position: 'Giám đốc vận hành',
      bio: 'Anh C chịu trách nhiệm xây dựng và quản lý hệ thống chuỗi cung ứng hiệu quả. Với nền tảng vững chắc từ ngành logistics, anh đảm bảo mọi sản phẩm đến tay khách hàng đúng hẹn.',
      image: 'assets/images/brand-story/founder-3.jpg',
    },
  ];

  values = [
    {
      title: 'Chất lượng',
      description:
        'Cam kết mang đến những sản phẩm chất lượng cao, bền đẹp theo thời gian',
      icon: 'pi pi-check-circle',
    },
    {
      title: 'Trung thực',
      description:
        'Minh bạch trong mọi hoạt động kinh doanh, từ nguồn gốc sản phẩm đến giá cả',
      icon: 'pi pi-heart-fill',
    },
    {
      title: 'Đổi mới',
      description:
        'Không ngừng cải tiến, mang đến những xu hướng thời trang mới nhất',
      icon: 'pi pi-star-fill',
    },
    {
      title: 'Bền vững',
      description:
        'Cam kết với môi trường và xã hội thông qua các hoạt động kinh doanh bền vững',
      icon: 'pi pi-globe',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
