import 'package:flutter/material.dart';
import '../auth/student_home_page.dart';
import 'student_documents_page.dart';
import 'student_profile_page.dart';
import 'student_document_request_page.dart';
import 'student_notifications_page.dart';
import 'student_search_page.dart';

class StudentMainScreen extends StatefulWidget {

  final int initialIndex;

  final Map<String, dynamic> userProfile;



  const StudentMainScreen({this.initialIndex = 0, required this.userProfile, Key? key}) : super(key: key);



  @override
  State<StudentMainScreen> createState() => _StudentMainScreenState();
}

class _StudentMainScreenState extends State<StudentMainScreen> {
  late int _selectedIndex;
  late List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.initialIndex;
    _pages = [
      StudentHomePage(
        userProfile: widget.userProfile,
      ),
      StudentDocumentsPage(
        userProfile: widget.userProfile,
      ),
      StudentProfilePage(
        userProfile: widget.userProfile,
      ),
    ];
  }

  void _onTabSelected(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _pages,
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: const [
            BoxShadow(color: Colors.black12, blurRadius: 8),
          ],
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _NavItem(
              icon: Icons.home,
              label: "Home",
              selected: _selectedIndex == 0,
              onTap: () => _onTabSelected(0),
            ),
            _NavItem(
              icon: Icons.folder_open,
              label: "Documents",
              selected: _selectedIndex == 1,
              onTap: () => _onTabSelected(1),
            ),
            _NavItem(
              icon: Icons.person,
              label: "Profile",
              selected: _selectedIndex == 2,
              onTap: () => _onTabSelected(2),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const _NavItem({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: selected ? Colors.blue.shade100 : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: TweenAnimationBuilder<double>(
          tween: Tween<double>(begin: 1.0, end: selected ? 1.2 : 1.0),
          duration: const Duration(milliseconds: 300),
          curve: Curves.elasticOut,
          builder: (context, scale, child) {
            return Transform.scale(
              scale: scale,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    icon,
                    color: selected ? Colors.blue : Colors.black54,
                    size: 28,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                      color: selected ? Colors.blue : Colors.black54,
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
