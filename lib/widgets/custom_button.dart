import 'package:flutter/material.dart';

// class CustomButtton extends StatelessWidget {
//   final VoidCallback onTap;
//   final String text;
//   const CustomButtton({super.key, required this.onTap, required this.text});

//   @override
//   Widget build(BuildContext context) {
//     final width = MediaQuery.of(context).size.width;
//     return Container(
//       decoration: const BoxDecoration(
//         boxShadow: [
//           BoxShadow(color: Colors.blue, blurRadius: 5, spreadRadius: 0),
//         ],
//       ),
//       child: ElevatedButton(
//         onPressed: onTap,
//         style: ElevatedButton.styleFrom(
//           minimumSize: Size(width, 50),
//           backgroundColor: Colors.blue,
//         ),
//         child: Text(text, style: const TextStyle(fontSize: 16)),
//       ),
//     );
//   }
// }

class CustomButton extends StatelessWidget {
  final VoidCallback onTap;
  final String text;
  const CustomButton({super.key, required this.onTap, required this.text});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return InkWell(
      onTap: onTap,
      child: Container(
        width: width,
        height: 50,
        decoration: const BoxDecoration(
          boxShadow: [
            BoxShadow(color: Colors.blue, blurRadius: 3, spreadRadius: 0),
          ],
        ),

        child: Center(
          child: Text(
            text,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}
