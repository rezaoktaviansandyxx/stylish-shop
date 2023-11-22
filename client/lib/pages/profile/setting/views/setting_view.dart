import 'package:cached_network_image/cached_network_image.dart';
import 'package:client/services/api_service/user/user_service_models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import '../controllers/setting_controller.dart';

class SettingView extends GetView<SettingController> {
  const SettingView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    Get.put(SettingController());
    return Scaffold(
      body: FutureBuilder(
          future: controller.getUser(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return Center(child: Text(snapshot.error.toString()));
            }
            final UserModel? user = snapshot.data;
            return SingleChildScrollView(
              child: SafeArea(
                child: Column(
                  children: [
                    Container(
                      margin:
                          REdgeInsets.symmetric(vertical: 10, horizontal: 30),
                      padding: REdgeInsets.all(10),
                      height: 0.13.sh,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20.r),
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black12,
                              blurRadius: 10.r,
                              offset: const Offset(0, 2),
                            )
                          ]),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10).r,
                            child: CachedNetworkImage(
                              imageUrl: (user?.image ?? '')
                                      .contains('placeholder')
                                  ? user?.image ??
                                      "https://via.placeholder.com/200"
                                  : 'https://storage.googleapis.com/${user?.image}',
                              height: 90.h,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => const Center(
                                  child: CircularProgressIndicator()),
                              errorWidget: (context, url, error) =>
                                  const Icon(Icons.error),
                            ),
                          ),
                          SizedBox(width: 20.w),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                user?.name ?? 'No Name',
                                style: TextStyle(
                                    fontSize: 20.sp,
                                    fontWeight: FontWeight.w700),
                              ),
                              Text(
                                user?.email ?? 'noEmail@gmail.com',
                                style: TextStyle(
                                    fontSize: 15.sp,
                                    fontWeight: FontWeight.w400,
                                    color: const Color(0xFF8E8E8E)),
                              )
                            ],
                          ),
                        ],
                      ),
                    ),
                    Container(
                      margin:
                          REdgeInsets.symmetric(vertical: 20, horizontal: 30),
                      padding: REdgeInsets.symmetric(vertical: 10),
                      height: 0.25.sh,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20.r),
                        border: Border.all(
                          color: const Color(0xFF938585),
                          width: 2,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Padding(
                            padding: REdgeInsets.symmetric(horizontal: 15),
                            child: Text(
                              'Account',
                              style: TextStyle(
                                  fontSize: 15.sp,
                                  color: const Color(0xFF938585)),
                            ),
                          ),
                          _IconText(
                            icon: Icons.person_2_outlined,
                            text: 'Personal Details',
                            handleClick: () => Get.toNamed('/personal-detail'),
                          ),
                          _IconText(
                            icon: Icons.list,
                            text: 'My Order',
                            handleClick: () => Get.toNamed('/order-ongoing'),
                          ),
                          _IconText(
                            icon: Icons.password,
                            text: 'Change Password',
                            handleClick: () => Get.toNamed('/change-password'),
                          )
                        ],
                      ),
                    ),
                    Container(
                      margin:
                          REdgeInsets.symmetric(vertical: 20, horizontal: 30),
                      padding: REdgeInsets.symmetric(vertical: 10),
                      height: 0.25.sh,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20.r),
                        border: Border.all(
                          color: const Color(0xFF938585),
                          width: 2,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Padding(
                            padding: REdgeInsets.symmetric(horizontal: 15),
                            child: Text(
                              'Other Info',
                              style: TextStyle(
                                  fontSize: 15.sp,
                                  color: const Color(0xFF938585)),
                            ),
                          ),
                          _IconText(
                            icon: Icons.business,
                            text: 'Privacy Policy',
                            handleClick: () => Get.toNamed('/privacy-policy'),
                          ),
                          _IconText(
                            icon: Icons.leaderboard_outlined,
                            text: 'Term & Conditions',
                            handleClick: () => Get.toNamed('/term-condition'),
                          ),
                          _IconText(
                            icon: Icons.list_alt_outlined,
                            text: 'About & Services',
                            handleClick: () => Get.toNamed('/about-service'),
                          )
                        ],
                      ),
                    ),
                    Padding(
                      padding: REdgeInsets.symmetric(
                          horizontal: 30.w, vertical: 10.h),
                      child: ElevatedButton(
                        onPressed: () => controller.logOut(),
                        style: ElevatedButton.styleFrom(
                            minimumSize: Size.fromHeight(60.h),
                            backgroundColor: Colors.black,
                            foregroundColor: Colors.white),
                        child: const Text('Logout'),
                      ),
                    )
                  ],
                ),
              ),
            );
          }),
    );
  }
}

class _IconText extends StatelessWidget {
  const _IconText(
      {required this.icon, required this.text, required this.handleClick});
  final IconData icon;
  final String text;
  final VoidCallback handleClick;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: handleClick,
        child: Padding(
          padding: REdgeInsets.symmetric(horizontal: 15, vertical: 5),
          child: Row(
            children: [
              Icon(
                icon,
                size: 30.sp,
              ),
              SizedBox(width: 20.w),
              Text(
                text,
                style: TextStyle(fontSize: 15.sp),
              ),
              const Spacer(),
              Icon(Icons.chevron_right, size: 30.sp)
            ],
          ),
        ),
      ),
    );
  }
}
